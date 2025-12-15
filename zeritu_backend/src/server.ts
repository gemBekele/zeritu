import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import fs from 'fs';

// BetterAuth - temporarily disabled due to import issues
// import { auth } from './config/auth';
// import { toNodeHandler } from './integrations/better-auth-node';

// Routes
import authRouter from './routes/auth';
import productsRouter from './routes/products';
import articlesRouter from './routes/articles';
import eventsRouter from './routes/events';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Allow multiple origins for development
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3001',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, allow any localhost origin
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const resolvedUploadDir = path.isAbsolute(uploadDir) ? uploadDir : path.join(process.cwd(), uploadDir);

// Ensure upload directory exists
if (!fs.existsSync(resolvedUploadDir)) {
  fs.mkdirSync(resolvedUploadDir, { recursive: true });
  console.log(`Created upload directory: ${resolvedUploadDir}`);
}

console.log(`Serving uploads from: ${resolvedUploadDir}`);
app.use('/uploads', express.static(resolvedUploadDir, {
  setHeaders: (res, filePath) => {
    // Set CORS headers for images
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
  }
}));

// BetterAuth handler (handles all BetterAuth routes including Google OAuth)
// Temporarily disabled - using legacy auth routes instead
// TODO: Fix better-auth integration import path
// const betterAuthHandler = toNodeHandler('handler' in auth ? auth.handler : auth);
// app.all('/api/auth/social/*', betterAuthHandler);
// app.all('/api/auth/sign-in-with-oauth', betterAuthHandler);
// app.all('/api/auth/callback/*', betterAuthHandler);

// Legacy auth routes (for backward compatibility with existing frontend)
app.use('/api/auth', authRouter);

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API docs available at http://localhost:${PORT}/api/health`);
});
