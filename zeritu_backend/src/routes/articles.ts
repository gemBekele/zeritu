import { Router } from 'express';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import prisma from '../config/database';
import { z } from 'zod';

const router = Router();

const articleSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  published: z.boolean().optional(),
});

// Get all articles (published only for public, all for admin)
router.get('/', async (req, res) => {
  try {
    const { search, page = '1', limit = '20', published } = req.query;
    
    const where: any = {};
    
    // If published query param is not 'all', only show published
    if (published !== 'all') {
      where.published = true;
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      articles,
      pagination: {
        page: parseInt(page as string),
        limit: take,
        total,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article (public if published, admin can see all)
router.get('/:id', async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create article (admin only)
router.post('/', requireAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    // Parse form data - convert strings to proper types
    const formData = {
      ...req.body,
      published: req.body.published === 'true' || req.body.published === true,
    };
    
    const body = articleSchema.parse(formData);
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const article = await prisma.article.create({
      data: {
        ...body,
        image: `/uploads/${req.file.filename}`,
        authorId: req.user!.id,
        published: body.published ?? false,
        publishedAt: body.published ? new Date() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(article);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update article (admin only)
router.put('/:id', requireAdmin, upload.single('image'), async (req: AuthRequest, res) => {
  try {
    // Parse form data - handle string booleans from form data
    const bodyData: any = { ...req.body };
    if (bodyData.published !== undefined) {
      bodyData.published = bodyData.published === 'true' || bodyData.published === true;
    }
    
    const body = articleSchema.partial().parse(bodyData);
    
    const updateData: any = { ...body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (body.published && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    } else if (body.published === false) {
      updateData.publishedAt = null;
    }

    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(article);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete article (admin only)
router.delete('/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.article.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

export default router;

