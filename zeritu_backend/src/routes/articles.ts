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

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const take = Math.max(1, Math.min(100, parseInt(limit as string) || 20));
    const skip = (pageNum - 1) * take;

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
          _count: {
            select: {
              comments: true,
              likes: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    res.json({
      articles,
      pagination: {
        page: pageNum,
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
        _count: {
          select: {
            comments: true,
            likes: true,
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
    
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl || null;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const article = await prisma.article.create({
      data: {
        ...body,
        image,
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
    } else if (req.body.imageUrl) {
      updateData.image = req.body.imageUrl;
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

// Increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: { viewCount: { increment: 1 } },
    });
    res.json({ viewCount: article.viewCount });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    res.status(500).json({ error: 'Failed to record view' });
  }
});

// Get comments for an article
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await prisma.articleComment.findMany({
      where: { articleId: req.params.id },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Add comment to article
router.post('/:id/comments', async (req, res) => {
  try {
    const { content, name, email } = z.object({
      content: z.string().min(1).max(5000),
      name: z.string().optional(),
      email: z.string().email().optional(),
    }).parse(req.body);

    const userId = (req as AuthRequest).user?.id;
    const comment = await prisma.articleComment.create({
      data: {
        articleId: req.params.id,
        content,
        userId: userId || null,
        name: userId ? undefined : (name || 'Anonymous'),
        email: userId ? undefined : email,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Delete comment (admin or comment owner)
router.delete('/:id/comments/:commentId', async (req: AuthRequest, res) => {
  try {
    const comment = await prisma.articleComment.findUnique({
      where: { id: req.params.commentId },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId && comment.userId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.articleComment.delete({
      where: { id: req.params.commentId },
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Like an article
router.post('/:id/like', requireAuth, async (req: AuthRequest, res) => {
  try {
    const existing = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId: req.params.id,
          userId: req.user!.id,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Already liked' });
    }

    const like = await prisma.articleLike.create({
      data: {
        articleId: req.params.id,
        userId: req.user!.id,
      },
    });

    const count = await prisma.articleLike.count({
      where: { articleId: req.params.id },
    });

    res.status(201).json({ like, count });
  } catch (error) {
    console.error('Error liking article:', error);
    res.status(500).json({ error: 'Failed to like article' });
  }
});

// Unlike an article
router.delete('/:id/like', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.articleLike.deleteMany({
      where: {
        articleId: req.params.id,
        userId: req.user!.id,
      },
    });

    const count = await prisma.articleLike.count({
      where: { articleId: req.params.id },
    });

    res.json({ count });
  } catch (error) {
    console.error('Error unliking article:', error);
    res.status(500).json({ error: 'Failed to unlike article' });
  }
});

// Get like status for current user
router.get('/:id/like/status', requireAuth, async (req: AuthRequest, res) => {
  try {
    const like = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId: req.params.id,
          userId: req.user!.id,
        },
      },
    });

    const count = await prisma.articleLike.count({
      where: { articleId: req.params.id },
    });

    res.json({ liked: !!like, count });
  } catch (error) {
    console.error('Error fetching like status:', error);
    res.status(500).json({ error: 'Failed to fetch like status' });
  }
});

export default router;

