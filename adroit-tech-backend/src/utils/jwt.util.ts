import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { TAccessTokenPayload, TRefreshTokenPayload } from '../types/auth.types';
import { UnauthorizedError } from '../shared/errors';

export const signAccessToken = (payload: Omit<TAccessTokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn'],
  });
};

export const signRefreshToken = (payload: Omit<TRefreshTokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string): TAccessTokenPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as TAccessTokenPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): TRefreshTokenPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as TRefreshTokenPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};
