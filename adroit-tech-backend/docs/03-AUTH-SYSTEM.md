# 03 — Authentication & Authorization System

## Overview

The system uses a **dual-token JWT strategy** with role-based access control (RBAC). Access tokens are short-lived; refresh tokens are long-lived and stored (hashed) in the database, enabling revocation.

---

## Token Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TOKEN LIFECYCLE                        │
│                                                          │
│  Login/Register                                          │
│       │                                                  │
│       ▼                                                  │
│  ┌──────────────┐    ┌────────────────────────────────┐  │
│  │ Access Token │    │       Refresh Token             │  │
│  │              │    │                                 │  │
│  │ Expiry: 15m  │    │ Expiry: 30 days                 │  │
│  │ Signed: RS256│    │ Stored: HASHED in DB            │  │
│  │ Payload:     │    │ Rotation: Yes (new on each use) │  │
│  │  - userId    │    │ Revocation: Soft-delete in DB   │  │
│  │  - role      │    └────────────────────────────────┘  │
│  │  - sessionId │                                        │
│  └──────────────┘                                        │
│                                                          │
│  Access Token expires → Client sends Refresh Token       │
│  Server verifies hash, issues NEW token pair             │
│  Old refresh token is revoked (rotation)                 │
│                                                          │
│  Logout → refresh token revoked in DB                    │
│  Logout All → ALL refresh tokens for user revoked        │
└─────────────────────────────────────────────────────────┘
```

---

## JWT Payload Structure

```typescript
// Access Token Payload
interface TAccessTokenPayload {
  sub: string;          // userId (UUID)
  role: UserRole;       // JOB_SEEKER | EMPLOYER | ADMIN
  sessionId: string;    // UUID — links to refresh token record
  iat: number;
  exp: number;
}

// Refresh Token Payload (minimal)
interface TRefreshTokenPayload {
  sub: string;          // userId
  sessionId: string;    // Must match DB record
  iat: number;
  exp: number;
}
```

---

## Signing Strategy

- Algorithm: **RS256** (asymmetric)
- Private key for signing (server only)
- Public key for verification (can be distributed to microservices)
- Keys loaded from environment, never committed

```typescript
// config/index.ts
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, 'utf8');
const JWT_PUBLIC_KEY  = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, 'utf8');

const ACCESS_TOKEN_EXPIRY  = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';
```

---

## Auth Flow Diagrams

### Registration

```
Client                          Server                     DB
  │                               │                         │
  │── POST /auth/register ────────▶                         │
  │   { name, email, password,    │                         │
  │     role, phone, ... }        │── validate Zod ────────▶│
  │                               │                         │
  │                               │── hash password ───────▶│
  │                               │   (bcrypt, 12 rounds)   │
  │                               │                         │
  │                               │── create User ─────────▶│
  │                               │── create Profile ───────▶│
  │                               │── queue verify email ──▶│
  │                               │                         │
  │                               │── generate token pair   │
  │                               │── store hashed RT ─────▶│
  │                               │                         │
  │◀── 201 { accessToken,         │                         │
  │          refreshToken,        │                         │
  │          user } ──────────────│                         │
```

### Login

```
Client                          Server                      Redis/DB
  │                               │                            │
  │── POST /auth/login ───────────▶                            │
  │   { email, password }         │── find user by email ─────▶│
  │                               │── compare bcrypt hash      │
  │                               │── check user status        │
  │                               │── update lastLoginAt ─────▶│
  │                               │── generate token pair      │
  │                               │── hash & store RT ────────▶│
  │◀── 200 { accessToken,         │                            │
  │          refreshToken, user } │                            │
```

### Access Token Refresh

```
Client                          Server                      DB
  │                               │                          │
  │── POST /auth/refresh ─────────▶                          │
  │   { refreshToken }            │── verify RT JWT sig      │
  │                               │── extract sessionId      │
  │                               │── find RT in DB ─────────▶│
  │                               │── compare hash           │
  │                               │── check not revoked      │
  │                               │── check not expired      │
  │                               │── REVOKE old RT ─────────▶│
  │                               │── generate new pair      │
  │                               │── store new hashed RT ───▶│
  │◀── 200 { accessToken,         │                          │
  │          refreshToken } ──────│                          │
```

### Logout

```
Client                          Server                      DB
  │── POST /auth/logout ──────────▶                          │
  │   { refreshToken }            │── verify JWT sig         │
  │   Authorization: Bearer AT   │── find RT in DB ─────────▶│
  │                               │── revoke RT ─────────────▶│
  │◀── 200 { message } ───────────│                          │
```

---

## RBAC (Role-Based Access Control)

### Roles

```typescript
enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  EMPLOYER   = 'EMPLOYER',
  ADMIN      = 'ADMIN',
}
```

### Permission Matrix

| Resource | Action | JOB_SEEKER | EMPLOYER | ADMIN |
|---|---|---|---|---|
| Jobs | Read (public) | ✅ | ✅ | ✅ |
| Jobs | Create | ❌ | ✅ (own) | ✅ |
| Jobs | Update | ❌ | ✅ (own) | ✅ |
| Jobs | Delete | ❌ | ✅ (own) | ✅ |
| Jobs | Feature | ❌ | ❌ | ✅ |
| Applications | Create | ✅ | ❌ | ✅ |
| Applications | Read | ✅ (own) | ✅ (own jobs) | ✅ |
| Applications | Update status | ❌ | ✅ (own jobs) | ✅ |
| Applications | Withdraw | ✅ (own) | ❌ | ✅ |
| JobSeekerProfile | Read | ✅ (own) | ✅ (applicants) | ✅ |
| JobSeekerProfile | Update | ✅ (own) | ❌ | ✅ |
| EmployerProfile | Read | ❌ | ✅ (own) | ✅ |
| EmployerProfile | Update | ❌ | ✅ (own) | ✅ |
| EmployerProfile | Approve | ❌ | ❌ | ✅ |
| Users | List | ❌ | ❌ | ✅ |
| Users | Suspend | ❌ | ❌ | ✅ |
| AuditLogs | Read | ❌ | ❌ | ✅ |

### RBAC Middleware

```typescript
// middleware/rbac.middleware.ts

import { RequestHandler } from 'express';
import { UserRole } from '@prisma/client';
import { ForbiddenError } from '../shared/errors';

/**
 * Restrict route to specific roles.
 * Must come AFTER auth.middleware (req.user must be set).
 */
export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ForbiddenError('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    next();
  };
};

// Usage in routes:
// router.post('/jobs', authenticate, requireRole(UserRole.EMPLOYER, UserRole.ADMIN), JobController.create);
```

### Resource Ownership Guard

For records that belong to a specific user, ownership is validated at the service layer:

```typescript
// Example in jobs.service.ts
async updateJob(jobId: string, userId: string, role: UserRole, data: UpdateJobDto) {
  const job = await this.findByIdOrThrow(jobId);

  // Admins bypass ownership check
  if (role !== UserRole.ADMIN) {
    const employer = await this.getEmployerByUserId(userId);
    if (job.employerId !== employer.id) {
      throw new ForbiddenError('You do not own this job listing');
    }
  }

  return this.prisma.job.update({ where: { id: jobId }, data });
}
```

---

## Auth Middleware

```typescript
// middleware/auth.middleware.ts

export const authenticate: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);  // throws on invalid/expired
    
    // Optionally check token revocation in Redis (for immediate logout)
    const isRevoked = await redis.get(`revoked:${payload.sessionId}`);
    if (isRevoked) {
      return next(new UnauthorizedError('Token has been revoked'));
    }

    req.user = {
      id:        payload.sub,
      role:      payload.role,
      sessionId: payload.sessionId,
    };

    next();
  } catch (err) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
```

---

## Email Verification Flow

```
1. User registers → OTP generated (6 digits, TTL 10 min)
2. OTP stored in Redis: key = `email_verify:{userId}`, value = hash(otp)
3. Email queued → Nodemailer sends OTP email
4. POST /auth/verify-email { otp }
5. Server compares hash → sets user.emailVerifiedAt → deletes Redis key
6. If EMPLOYER: status stays PENDING_APPROVAL until admin approves
```

---

## Password Reset Flow

```
1. POST /auth/forgot-password { email }
2. Generate secure random token (crypto.randomBytes)
3. Store: Redis key = `pwd_reset:{token}`, value = userId, TTL = 1 hour
4. Queue email with reset link containing token
5. POST /auth/reset-password { token, newPassword, confirmPassword }
6. Verify token in Redis → hash new password → update user
7. Delete Redis token + revoke ALL refresh tokens for that user
```

---

## Token Storage (Redis Keys)

```
email_verify:{userId}       TTL: 10min    Value: hashed OTP
pwd_reset:{token}           TTL: 1hour    Value: userId
revoked:{sessionId}         TTL: 15min    Value: "1" (matches AT expiry)
rate_limit:{ip}:{endpoint}  TTL: 1min     Value: counter
```
