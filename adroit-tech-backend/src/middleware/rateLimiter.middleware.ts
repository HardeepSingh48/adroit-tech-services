import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.config';
import { TooManyRequestsError } from '../shared/errors';

const createLimiter = (windowMs: number, max: number, message: string) => {
  const store = redis.isOpen
    ? new RedisStore({
        sendCommand: (async (...args: string[]) => {
          return redis.sendCommand(args);
        }) as unknown as (...args: string[]) => Promise<never>,
      })
    : undefined;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store,
    handler: (_req, _res, next) => next(new TooManyRequestsError(message)),
  });
};

export const globalRateLimiter = createLimiter(
  15 * 60 * 1000,
  1000,
  'Too many requests. Please try again in 15 minutes.'
);

export const authRateLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many authentication attempts. Please wait 15 minutes.'
);

export const passwordResetLimiter = createLimiter(
  60 * 60 * 1000,
  3,
  'Too many password reset requests. Please try again in 1 hour.'
);

export const uploadRateLimiter = createLimiter(
  60 * 60 * 1000,
  20,
  'Upload limit reached. Please try again later.'
);
