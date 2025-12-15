import { Router } from 'express';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import prisma from '../config/database';
import { z } from 'zod';
import { createChapaPayment, verifyChapaPayment } from '../services/chapa';

const router = Router();

const orderSchema = z.object({
  shippingName: z.string().min(1),
  shippingEmail: z.string().email(),
  shippingPhone: z.string().min(1),
  shippingAddress: z.string().min(1),
});

// Get user's orders
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const where: any = isAdmin ? {} : { userId: req.user!.id };

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.userId !== req.user!.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order from cart
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    console.log('Order creation request body:', req.body);
    console.log('User:', req.user?.id);
    const shipping = orderSchema.parse(req.body);

    // Get user's cart
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        total,
        shippingName: shipping.shippingName,
        shippingEmail: shipping.shippingEmail,
        shippingPhone: shipping.shippingPhone,
        shippingAddress: shipping.shippingAddress,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create Chapa payment
    try {
      // Use FRONTEND_URL or default to port 3002 (current frontend port)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
      const backendUrl = process.env.BETTER_AUTH_BASE_URL || process.env.BACKEND_URL || 'http://localhost:3001';
      
      const returnUrl = `${frontendUrl}/shop/checkout/success?orderId=${order.id}`;
      console.log('Chapa return URL:', returnUrl);
      console.log('FRONTEND_URL env:', process.env.FRONTEND_URL);
      
      const payment = await createChapaPayment({
        amount: total,
        currency: 'ETB',
        email: shipping.shippingEmail,
        first_name: shipping.shippingName.split(' ')[0] || shipping.shippingName,
        last_name: shipping.shippingName.split(' ').slice(1).join(' ') || '',
        phone_number: shipping.shippingPhone,
        tx_ref: order.id,
        callback_url: `${backendUrl}/api/orders/webhook`,
        return_url: returnUrl,
      });

      // Update order with Chapa transaction reference
      await prisma.order.update({
        where: { id: order.id },
        data: { chapaTxRef: payment.tx_ref },
      });

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { userId: req.user!.id },
      });

      res.status(201).json({
        order,
        payment_url: payment.checkout_url,
      });
    } catch (paymentError) {
      console.error('Chapa payment error:', paymentError);
      // Order is created but payment failed
      res.status(201).json({
        order,
        payment_url: null,
        error: 'Payment initialization failed',
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Order validation error:', error.errors);
      return res.status(400).json({ 
        error: 'Invalid order data',
        message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
        details: error.errors 
      });
    }
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', message: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Update order status (admin only)
router.put('/:id/status', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { status, paymentStatus } = z.object({
      status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
      paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
    }).parse(req.body);

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Verify payment for an order (called when user returns from payment)
router.post('/:id/verify-payment', requireAuth, async (req: AuthRequest, res) => {
  try {
    console.log(`Verifying payment for order: ${req.params.id}`);
    
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      console.log(`Order not found: ${req.params.id}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`Order found. Current status: ${order.paymentStatus}, chapaTxRef: ${order.chapaTxRef}`);

    // Check if user owns the order or is admin
    if (order.userId !== req.user!.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // If order already has payment status as PAID, return early
    if (order.paymentStatus === 'PAID') {
      console.log(`Order ${order.id} already PAID`);
      return res.json({ order, updated: false });
    }

    // Try to verify payment with Chapa
    // First try with chapaTxRef, then with order.id (since we use order.id as tx_ref when creating payment)
    const txRefsToTry = [order.chapaTxRef, order.id].filter(Boolean);
    
    for (const txRef of txRefsToTry) {
      console.log(`Calling Chapa API to verify tx_ref: ${txRef}`);
      try {
        const isPaid = await verifyChapaPayment(txRef!);
        console.log(`Chapa verification result for ${txRef}: ${isPaid}`);

        if (isPaid) {
          console.log(`Updating order ${order.id} to PAID`);
          const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'PAID',
              status: 'CONFIRMED',
            },
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          });

          console.log(`Order ${order.id} updated to PAID successfully`);
          return res.json({ order: updatedOrder, updated: true });
        } else {
          console.log(`Verification for ${txRef} returned false - trying next tx_ref if available`);
        }
      } catch (verifyError) {
        console.error(`Chapa verification error for ${txRef}:`, verifyError);
        // Continue to try next tx_ref
      }
    }
    
    console.log(`All verification attempts failed for order ${order.id}`);

    // Return current order status
    console.log(`Returning order ${order.id} with status: ${order.paymentStatus}`);
    res.json({ order, updated: false });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Webhook for Chapa payment
router.post('/webhook', async (req, res) => {
  try {
    console.log('Chapa webhook received:', JSON.stringify(req.body, null, 2));
    console.log('Chapa webhook headers:', JSON.stringify(req.headers, null, 2));
    
    // Chapa webhook can send data in different formats
    // Check for both direct status and nested data.status
    const tx_ref = req.body.tx_ref || req.body.data?.tx_ref || req.body.txRef;
    const status = req.body.status || req.body.data?.status;
    
    if (!tx_ref) {
      console.error('Missing transaction reference in webhook. Body:', req.body);
      return res.status(400).json({ error: 'Missing transaction reference' });
    }

    console.log(`Looking for order with chapaTxRef: ${tx_ref}`);
    
    // Try to find order by chapaTxRef first
    let order = await prisma.order.findUnique({
      where: { chapaTxRef: tx_ref },
    });

    // If not found by chapaTxRef, try to find by order ID (since we use order.id as tx_ref)
    if (!order) {
      console.log(`Order not found by chapaTxRef, trying by order ID: ${tx_ref}`);
      order = await prisma.order.findUnique({
        where: { id: tx_ref },
      });
    }

    if (!order) {
      console.error(`Order not found for tx_ref: ${tx_ref}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`Found order ${order.id} for tx_ref: ${tx_ref}, current status: ${order.paymentStatus}`);

    // Chapa sends 'success' or 'successful' for successful payments
    // Also check for 'completed' status and various case combinations
    const statusLower = status?.toLowerCase();
    const isSuccess = statusLower === 'success' || 
                      statusLower === 'successful' || 
                      statusLower === 'completed' ||
                      status === 'success' ||
                      status === 'successful' ||
                      (req.body.data && (req.body.data.status === 'successful' || req.body.data.status === 'success'));

    if (isSuccess) {
      console.log(`Updating order ${order.id} to PAID (status: ${status})`);
      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
        },
      });
      console.log(`Order ${order.id} updated successfully. New status: ${updatedOrder.paymentStatus}`);
      return res.json({ message: 'Webhook processed', orderId: order.id, status: 'PAID' });
    } else {
      console.log(`Updating order ${order.id} to FAILED (status: ${status})`);
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'FAILED',
        },
      });
      return res.json({ message: 'Webhook processed', orderId: order.id, status: 'FAILED' });
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

export default router;



