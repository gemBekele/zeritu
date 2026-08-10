import { Router } from 'express';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import prisma from '../config/database';
import { z } from 'zod';
import crypto from 'crypto';

const router = Router();

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().transform((str) => new Date(str)),
  time: z.string().min(1),
  location: z.string().min(1),
  capacity: z.string().transform(v => parseInt(v)).or(z.number()).optional(),
  ticketPrice: z.string().transform(v => parseFloat(v)).or(z.number()).optional(),
  status: z.enum(['UPCOMING', 'PAST', 'CANCELLED']).optional(),
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;
    
    const where: any = {};

    if (status && typeof status === 'string') {
      where.status = status;
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const take = Math.max(1, Math.min(100, parseInt(limit as string) || 20));
    const skip = (pageNum - 1) * take;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
      }),
      prisma.event.count({ where }),
    ]);

    res.json({
      events,
      pagination: {
        page: pageNum,
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event (admin only)
router.post('/', requireAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const body = eventSchema.parse(req.body);
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const event = await prisma.event.create({
      data: {
        ...body,
        image: `/uploads/${req.file.filename}`,
        status: body.status || 'UPCOMING',
      },
    });

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (admin only)
router.put('/:id', requireAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    const body = eventSchema.partial().parse(req.body);
    
    const updateData: any = { ...body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (body.date) {
      updateData.date = new Date(body.date);
    }

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event (admin only)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Get event registrations (admin only)
router.get('/:id/registrations', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId: req.params.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Register for an event (public)
router.post('/:id/register', async (req, res) => {
  try {
    const { name, email, phone, quantity } = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      quantity: z.number().int().min(1).max(10).default(1),
    }).parse(req.body);

    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.status !== 'UPCOMING') {
      return res.status(400).json({ error: 'Event is not open for registration' });
    }

    if (event.capacity > 0) {
      const confirmedCount = await prisma.eventRegistration.count({
        where: { eventId: req.params.id, status: 'CONFIRMED' },
      });
      if (confirmedCount + quantity > event.capacity) {
        return res.status(400).json({ error: 'Event is at full capacity' });
      }
    }

    const ticketRef = `TKT-${event.id.slice(0, 4).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const userId = (req as AuthRequest).user?.id;

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: req.params.id,
        userId: userId || null,
        name,
        email,
        phone,
        quantity,
        ticketRef,
      },
    });

    res.status(201).json(registration);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to register for event' });
  }
});

// Cancel registration
router.delete('/:id/registrations/:regId', async (req: AuthRequest, res) => {
  try {
    const reg = await prisma.eventRegistration.findUnique({
      where: { id: req.params.regId },
    });
    if (!reg) return res.status(404).json({ error: 'Registration not found' });

    if (reg.userId && reg.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.eventRegistration.update({
      where: { id: req.params.regId },
      data: { status: 'CANCELLED' },
    });

    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});

export default router;








