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

    try {
      if (redis.isOpen) {
        const revokedKey = `revoked:session:${payload.sessionId}`;
        const isRevoked = await redis.get(revokedKey);
        if (isRevoked) {
          throw new UnauthorizedError('Session has been terminated');
        }
      }
    } catch (err) {
      if (err instanceof UnauthorizedError) throw err;
      // Ignores redis connection issue in auth check
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
      sessionId: payload.sessionId,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) return next(error);
    next(new UnauthorizedError('Invalid or expired token'));
  }
};

export const optionalAuthenticate: RequestHandler = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  try {
    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, sessionId: payload.sessionId };
  } catch {
    // Silently ignore
  }
  next();
};
