import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { winstonStream } from './config/logger.config';
import { redis } from './config/redis.config';
import { prisma } from './database/prisma';

import { requestIdMiddleware } from './middleware/requestId.middleware';
import { globalRateLimiter } from './middleware/rateLimiter.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { globalErrorHandler } from './middleware/errorHandler.middleware';

import authRouter from './modules/auth/auth.routes';
import jobsRouter from './modules/jobs/jobs.routes';
import jobSeekersRouter from './modules/job-seekers/job-seekers.routes';
import employersRouter from './modules/employers/employers.routes';
import adminRouter from './modules/admin/admin.routes';
import uploadsRouter from './modules/uploads/uploads.routes';

const app = express();

app.use(requestIdMiddleware);
app.use(helmet());

const allowedOrigins = config.CORS_ORIGINS.split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || config.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan('combined', { stream: winstonStream }));
app.use(globalRateLimiter);

// Health check endpoints
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.get('/health/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'READY', database: 'CONNECTED', redis: redis.isOpen ? 'CONNECTED' : 'DISCONNECTED' });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(503).json({ status: 'NOT_READY', error: errorMessage });
  }
});

// API Routes
const apiPrefix = `/api/${config.API_VERSION}`;
app.use(`${apiPrefix}/auth`, authRouter);
app.use(`${apiPrefix}/jobs`, jobsRouter);
app.use(`${apiPrefix}/job-seekers`, jobSeekersRouter);
app.use(`${apiPrefix}/employers`, employersRouter);
app.use(`${apiPrefix}/admin`, adminRouter);
app.use(`${apiPrefix}/uploads`, uploadsRouter);

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

export { app };
