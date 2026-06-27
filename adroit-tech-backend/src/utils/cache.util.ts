import { redis } from '../config/redis.config';

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  try {
    if (redis.isOpen) {
      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached) as T;
      }
    }
  } catch {
    // Ignore cache lookup errors
  }

  const data = await fetchFn();

  try {
    if (redis.isOpen) {
      await redis.setEx(key, ttlSeconds, JSON.stringify(data));
    }
  } catch {
    // Ignore cache store errors
  }

  return data;
}

export async function invalidateCache(...keys: string[]): Promise<void> {
  try {
    if (redis.isOpen && keys.length > 0) {
      await redis.del(keys);
    }
  } catch {
    // Ignore cache deletion errors
  }
}
