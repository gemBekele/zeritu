import { Router, Request, Response } from 'express';
import { createUser, verifyUser } from '../config/auth-simple';
import prisma from '../config/database';
import { z } from 'zod';

const router = Router();

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Simple session storage (in production, use proper session store)
const sessions = new Map<string, { userId: string; email: string; role: string }>();

// Sign up
router.post('/sign-up', async (req: Request, res: Response) => {
  try {
    const body = signUpSchema.parse(req.body);
    
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await createUser(body.email, body.password, body.name);
    
    // Create session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('session', sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// Sign in
router.post('/sign-in', async (req: Request, res: Response) => {
  try {
    const body = signInSchema.parse(req.body);
    
    const user = await verifyUser(body.email, body.password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessions.set(sessionId, {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie('session', sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

// Get session
router.get('/session', async (req: Request, res: Response) => {
  const sessionId = req.cookies?.session;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'No session' });
  }

  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

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
    return res.status(401).json({ error: 'User not found' });
  }

  res.json({ user });
});

// Sign out
router.post('/sign-out', (req: Request, res: Response) => {
  const sessionId = req.cookies?.session;
  
  if (sessionId) {
    sessions.delete(sessionId);
  }

  res.clearCookie('session');
  res.json({ message: 'Signed out' });
});

// Export sessions for middleware
export { sessions };

export default router;








