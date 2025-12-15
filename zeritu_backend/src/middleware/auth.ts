import { Request, Response, NextFunction } from 'express';
import { sessions } from '../routes/auth';
import { auth } from '../config/auth';
import prisma from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
    role: 'USER' | 'ADMIN';
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try BetterAuth session first
    try {
      const betterAuthSession = await auth.api.getSession({ headers: req.headers });
      if (betterAuthSession?.user) {
        const user = await prisma.user.findUnique({
          where: { id: betterAuthSession.user.id },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        });
        
        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            role: user.role,
          };
          return next();
        }
      }
    } catch (betterAuthError) {
      // Fall through to legacy auth
    }

    // Fallback to legacy session
    const sessionId = req.cookies?.session;
    
    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user from database to ensure it still exists
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  await requireAuth(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
    next();
  });
};

