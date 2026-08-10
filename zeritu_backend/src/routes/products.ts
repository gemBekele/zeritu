import { Router } from 'express';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import prisma from '../config/database';
import { z } from 'zod';

const router = Router();

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.enum(['Books', 'Music', 'Merch']),
  stock: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

// Get all products (public, admin can see inactive)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = '1', limit = '20', includeInactive } = req.query;
    
    const where: any = {};
    
    if (includeInactive !== 'true') {
      where.isActive = true;
    }

    if (category && typeof category === 'string') {
      where.category = category;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const take = Math.max(1, Math.min(100, parseInt(limit as string) || 20));
    const skip = (pageNum - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', requireAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    // Parse form data - convert strings to proper types
    const formData = {
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
      stock: req.body.stock ? parseInt(req.body.stock) : undefined,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
    };
    
    const body = productSchema.parse(formData);
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const product = await prisma.product.create({
      data: {
        ...body,
        image: `/uploads/${req.file.filename}`,
        stock: body.stock ?? 0,
        isActive: body.isActive ?? true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', requireAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    // Parse form data - convert strings to proper types
    const formData = { ...req.body };
    if (formData.price !== undefined) formData.price = parseFloat(formData.price);
    if (formData.stock !== undefined) formData.stock = parseInt(formData.stock);
    if (formData.isActive !== undefined) formData.isActive = formData.isActive === 'true' || formData.isActive === true;
    
    const body = productSchema.partial().parse(formData);
    
    const updateData: any = { ...body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;

