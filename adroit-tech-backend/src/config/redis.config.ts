import { createClient } from 'redis';
import { config } from './index';
import { logger } from './logger.config';

export const redis = createClient({
  url: config.REDIS_URL,
});

redis.on('error', (err) => {
  logger.error('Redis Client Error', { error: err.message });
});

redis.on('connect', () => {
  logger.info('Redis Client Connected');
});

// Async wrapper to safely connect Redis without blocking if server is unavailable in dev
export const initRedis = async () => {
  try {
    await redis.connect();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.warn('Failed to connect to Redis, continuing with degraded functionality', { error: errorMessage });
  }
};
