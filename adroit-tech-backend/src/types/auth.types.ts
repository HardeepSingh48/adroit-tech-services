import { UserRole } from '@prisma/client';

export interface TAccessTokenPayload {
  sub: string;
  role: UserRole;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface TRefreshTokenPayload {
  sub: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: string;
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}
