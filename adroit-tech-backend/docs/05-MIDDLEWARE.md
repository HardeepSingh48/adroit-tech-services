# 05 — Middleware Architecture

## Middleware Stack (Order Matters)

```typescript
// app.ts — middleware registration order

app.use(requestIdMiddleware);       // 1. Assign UUID to every request
app.use(helmet());                  // 2. Security headers
app.use(cors(corsOptions));         // 3. CORS
app.use(express.json({ limit: '2mb' }));  // 4. Body parser
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(morgan('combined', { stream: winstonStream }));  // 5. HTTP logging
app.use(globalRateLimiter);         // 6. Global rate limit (1000/15min per IP)

// Routes (each route may add auth + rbac + validate + specific rate limit)
app.use('/api/v1/auth', authRateLimiter, authRouter);
app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1/job-seekers', authenticate, requireRole('JOB_SEEKER'), jobSeekersRouter);
app.use('/api/v1/employers', authenticate, requireRole('EMPLOYER'), employersRouter);
app.use('/api/v1/admin', authenticate, requireRole('ADMIN'), adminRouter);
app.use('/api/v1/uploads', authenticate, uploadsRouter);

// Error handlers — MUST be last
app.use(notFoundHandler);           // 7. 404 handler
app.use(globalErrorHandler);        // 8. Global error handler
```

---

## 1. Request ID Middleware

```typescript
// middleware/requestId.middleware.ts
import { v4 as uuidv4 } from 'uuid';
import { RequestHandler } from 'express';

export const requestIdMiddleware: RequestHandler = (req, res, next) => {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};
```

---

## 2. Authentication Middleware

```typescript
// middleware/auth.middleware.ts
import { RequestHandler } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { redis } from '../config/redis.config';
import { UnauthorizedError } from '../shared/errors';

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authorization header missing or malformed');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    // Check if session is explicitly revoked in Redis
    // (used for immediate logout without waiting for AT expiry)
    const revokedKey = `revoked:session:${payload.sessionId}`;
    const isRevoked = await redis.get(revokedKey);
    if (isRevoked) {
      throw new UnauthorizedError('Session has been terminated');
    }

    req.user = {
      id:        payload.sub,
      role:      payload.role,
      sessionId: payload.sessionId,
    };

    next();
  } catch (error) {
    // Re-throw AppErrors; wrap JWT errors
    if (error instanceof UnauthorizedError) return next(error);
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

// Optional auth — attaches user if token provided but doesn't reject
export const optionalAuthenticate: RequestHandler = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  try {
    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, sessionId: payload.sessionId };
  } catch {
    // Silently ignore — no user attached
  }
  next();
};
```

---

## 3. RBAC Middleware

```typescript
// middleware/rbac.middleware.ts
import { RequestHandler } from 'express';
import { UserRole } from '@prisma/client';
import { ForbiddenError } from '../shared/errors';

export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(
        new ForbiddenError(
          `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

// Usage examples:
// requireRole(UserRole.ADMIN)
// requireRole(UserRole.EMPLOYER, UserRole.ADMIN)
```

---

## 4. Validation Middleware (Zod)

```typescript
// middleware/validate.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../shared/errors';

type ValidateTarget = 'body' | 'query' | 'params';

/**
 * Factory function — creates a middleware that validates
 * the specified target (body/query/params) against a Zod schema.
 *
 * @example
 * router.post('/jobs', validate('body', createJobSchema), JobController.create)
 */
export const validate = (target: ValidateTarget, schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Parse and replace with sanitized, typed data
      req[target] = schema.parse(req[target]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field:   err.path.join('.'),
          message: err.message,
        }));
        return next(new ValidationError('Validation failed', formattedErrors));
      }
      next(error);
    }
  };
};
```

---

## 5. Rate Limiter Middleware

```typescript
// middleware/rateLimiter.middleware.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.config';
import { TooManyRequestsError } from '../shared/errors';

const createLimiter = (windowMs: number, max: number, message: string) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({ sendCommand: (...args) => redis.sendCommand(args) }),
    handler: (_req, _res, next) => next(new TooManyRequestsError(message)),
  });

// Global: 1000 requests per 15 minutes per IP
export const globalRateLimiter = createLimiter(
  15 * 60 * 1000,
  1000,
  'Too many requests. Please try again in 15 minutes.'
);

// Auth endpoints: stricter to prevent brute force
export const authRateLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many authentication attempts. Please wait 15 minutes.'
);

// Password reset: very strict
export const passwordResetLimiter = createLimiter(
  60 * 60 * 1000,  // 1 hour
  3,
  'Too many password reset requests. Please try again in 1 hour.'
);

// File uploads: prevent abuse
export const uploadRateLimiter = createLimiter(
  60 * 60 * 1000,  // 1 hour
  20,
  'Upload limit reached. Please try again later.'
);
```

---

## 6. File Upload Middleware

```typescript
// middleware/upload.middleware.ts
import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../shared/errors';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_DOC_TYPES   = ['application/pdf', ...ALLOWED_IMAGE_TYPES];

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;   // 2MB
const MAX_DOC_SIZE   = 5 * 1024 * 1024;   // 5MB

// Memory storage — files go to S3 via service, not disk
const storage = multer.memoryStorage();

const fileFilter = (
  allowedTypes: string[],
  maxSize: number
) => (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new BadRequestError(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`));
  }
  cb(null, true);
};

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE),
});

export const uploadDocument = multer({
  storage,
  limits: { fileSize: MAX_DOC_SIZE },
  fileFilter: fileFilter(ALLOWED_DOC_TYPES, MAX_DOC_SIZE),
});
```

---

## 7. Global Error Handler

```typescript
// middleware/errorHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';
import { logger } from '../config/logger.config';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestId = req.requestId || 'unknown';

  // Known operational errors (our AppError subclasses)
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error('Operational error', {
        requestId,
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
        errorCode: err.errorCode,
        message: err.message,
        stack: err.stack,
      });
    } else {
      logger.warn('Client error', {
        requestId,
        statusCode: err.statusCode,
        errorCode: err.errorCode,
        message: err.message,
      });
    }

    return res.status(err.statusCode).json({
      success:    false,
      statusCode: err.statusCode,
      errorCode:  err.errorCode,
      message:    err.message,
      ...(err.errors && { errors: err.errors }),
      requestId,
    });
  }

  // Prisma known errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return handlePrismaError(err as any, req, res, requestId);
  }

  // Unknown/programmer errors — always 500
  logger.error('Unhandled error', {
    requestId,
    path: req.path,
    method: req.method,
    message: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    success:    false,
    statusCode: 500,
    errorCode:  'INTERNAL_SERVER_ERROR',
    message:    'An unexpected error occurred. Our team has been notified.',
    requestId,
  });
};

function handlePrismaError(err: any, req: Request, res: Response, requestId: string) {
  switch (err.code) {
    case 'P2002': // Unique constraint violation
      return res.status(409).json({
        success:    false,
        statusCode: 409,
        errorCode:  'DUPLICATE_RECORD',
        message:    `A record with this ${err.meta?.target?.join(', ')} already exists.`,
        requestId,
      });
    case 'P2025': // Record not found
      return res.status(404).json({
        success:    false,
        statusCode: 404,
        errorCode:  'NOT_FOUND',
        message:    'The requested resource was not found.',
        requestId,
      });
    default:
      return res.status(500).json({
        success:    false,
        statusCode: 500,
        errorCode:  'DATABASE_ERROR',
        message:    'A database error occurred.',
        requestId,
      });
  }
}
```

---

## 8. Not Found Handler

```typescript
// middleware/notFound.middleware.ts
import { RequestHandler } from 'express';
import { NotFoundError } from '../shared/errors';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};
```

---

## Express Type Augmentation

```typescript
// types/express.d.ts
declare namespace Express {
  interface Request {
    requestId: string;
    user?: {
      id:        string;
      role:      string;
      sessionId: string;
    };
  }
}
```
