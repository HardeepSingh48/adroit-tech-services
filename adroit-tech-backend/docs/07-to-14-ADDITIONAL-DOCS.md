# 07 — File Upload Strategy (AWS S3)

## Architecture

```
Client → POST /uploads/presigned-url → Server → Generate S3 Pre-signed URL
Client → PUT [presigned URL] → S3 directly (bypasses server)
Client → PATCH /job-seekers/profile { photoKey: "uploads/photos/uuid.jpg" }
Server → verify key exists in S3 → save URL to DB
```

**Why pre-signed URLs?** Files go directly from browser to S3 — no bandwidth cost on the API server. The server only validates and records the metadata after upload.

---

## S3 Bucket Structure

```
adroit-tech-prod/
├── resumes/           {userId}/{uuid}.pdf
├── photos/            {userId}/{uuid}.jpg
├── company-logos/     {employerId}/{uuid}.png
├── pan-cards/         {employerId}/{uuid}.pdf   (private, no public read)
└── temp/              {uuid}.ext                (auto-deleted after 1 hour via S3 lifecycle)
```

---

## Pre-signed URL Flow

```typescript
// uploads/uploads.service.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class UploadsService {
  async getPresignedUploadUrl(
    userId:   string,
    fileType: DocumentType,
    mimeType: string,
    fileName: string,
  ): Promise<{ uploadUrl: string; s3Key: string; expiresIn: number }> {
    // Validate mime type for document type
    this.validateMimeType(fileType, mimeType);

    const ext    = this.getExtension(mimeType);
    const s3Key  = `${this.getFolderForType(fileType)}/${userId}/${uuidv4()}.${ext}`;
    const bucket = config.AWS_S3_BUCKET;

    const command = new PutObjectCommand({
      Bucket:      bucket,
      Key:         s3Key,
      ContentType: mimeType,
      Metadata: {
        userId,
        documentType: fileType,
        originalName: sanitizeFileName(fileName),
      },
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 min

    return { uploadUrl, s3Key, expiresIn: 300 };
  }

  async confirmUpload(
    userId:      string,
    s3Key:       string,
    documentType: DocumentType,
    originalName: string,
  ): Promise<Document> {
    // Verify the file actually exists in S3
    await this.verifyS3Object(s3Key);

    const headResult = await this.getS3ObjectHead(s3Key);

    // Create Document record
    return this.prisma.document.create({
      data: {
        userId,
        type:         documentType,
        fileName:     path.basename(s3Key),
        originalName,
        mimeType:     headResult.ContentType!,
        sizeBytes:    headResult.ContentLength!,
        s3Key,
        s3Bucket:     config.AWS_S3_BUCKET,
        url:          this.buildCloudfrontUrl(s3Key),
        createdById:  userId,
      },
    });
  }
}
```

---

## CloudFront CDN

- Public files (photos, logos, resumes for download) served via CloudFront
- Private files (PAN cards) accessed only via server-generated signed CloudFront URLs
- S3 bucket policy: no public read; only CloudFront OAC can read

---

# 08 — Caching Strategy (Redis)

## What to Cache

| Data | TTL | Key Pattern | Strategy |
|---|---|---|---|
| Active jobs list | 5 min | `jobs:list:{hash-of-filters}` | Cache-aside |
| Single job detail | 10 min | `job:{id}` | Cache-aside |
| Featured jobs | 5 min | `jobs:featured` | Cache-aside |
| Platform stats | 60 min | `stats:platform` | Cache-aside |
| Employer dashboard stats | 5 min | `stats:employer:{employerId}` | Cache-aside |

## What NOT to Cache

- Application data (real-time accuracy required)
- User profile data (mutation frequency too high)
- Anything security-related

## Cache Implementation Pattern

```typescript
// utils/cache.util.ts

export async function withCache<T>(
  key:      string,
  ttlSeconds: number,
  fetchFn:  () => Promise<T>,
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached) as T;
  }

  // Cache miss — fetch from DB
  const data = await fetchFn();
  await redis.setEx(key, ttlSeconds, JSON.stringify(data));
  return data;
}

// Cache invalidation helper
export async function invalidateCache(...keys: string[]): Promise<void> {
  if (keys.length > 0) {
    await redis.del(keys);
  }
}

// Pattern-based invalidation (e.g., all job list caches)
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(keys);
  }
}
```

## Cache Key Constants

```typescript
// constants/cache-keys.constants.ts

export const CACHE_KEYS = {
  JOBS_LIST:          (filterHash: string) => `jobs:list:${filterHash}`,
  JOB_DETAIL:         (id: string)         => `job:${id}`,
  JOBS_FEATURED:                              'jobs:featured',
  PLATFORM_STATS:                             'stats:platform',
  EMPLOYER_STATS:     (id: string)         => `stats:employer:${id}`,
} as const;
```

---

# 09 — Error Handling

## Error Codes Reference

```typescript
// constants/error-codes.constants.ts

export const ERROR_CODES = {
  // 400
  VALIDATION_ERROR:          'VALIDATION_ERROR',
  INVALID_FILE_TYPE:         'INVALID_FILE_TYPE',
  INVALID_FILE_SIZE:         'INVALID_FILE_SIZE',
  
  // 401
  UNAUTHORIZED:              'UNAUTHORIZED',
  TOKEN_EXPIRED:             'TOKEN_EXPIRED',
  TOKEN_REVOKED:             'TOKEN_REVOKED',
  INVALID_CREDENTIALS:       'INVALID_CREDENTIALS',
  
  // 403
  FORBIDDEN:                 'FORBIDDEN',
  ACCOUNT_SUSPENDED:         'ACCOUNT_SUSPENDED',
  EMPLOYER_NOT_APPROVED:     'EMPLOYER_NOT_APPROVED',
  
  // 404
  NOT_FOUND:                 'NOT_FOUND',
  USER_NOT_FOUND:            'USER_NOT_FOUND',
  JOB_NOT_FOUND:             'JOB_NOT_FOUND',
  APPLICATION_NOT_FOUND:     'APPLICATION_NOT_FOUND',
  
  // 409
  CONFLICT:                  'CONFLICT',
  DUPLICATE_EMAIL:           'DUPLICATE_EMAIL',
  DUPLICATE_PHONE:           'DUPLICATE_PHONE',
  ALREADY_APPLIED:           'ALREADY_APPLIED',
  
  // 422
  UNPROCESSABLE_ENTITY:      'UNPROCESSABLE_ENTITY',
  JOB_DEADLINE_PASSED:       'JOB_DEADLINE_PASSED',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  
  // 429
  TOO_MANY_REQUESTS:         'TOO_MANY_REQUESTS',
  
  // 500
  INTERNAL_SERVER_ERROR:     'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR:            'DATABASE_ERROR',
  S3_ERROR:                  'S3_ERROR',
} as const;
```

---

# 10 — Environment Configuration

## `.env.example`

```bash
# ─── Application ───────────────────────────────────────
NODE_ENV=development
PORT=3000
API_VERSION=v1
APP_NAME="Adroit Tech Career API"

# ─── Database ──────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/adroit_db?schema=public"
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ─── Redis ─────────────────────────────────────────────
REDIS_URL="redis://localhost:6379"
REDIS_TLS=false

# ─── JWT ───────────────────────────────────────────────
JWT_PRIVATE_KEY_PATH="./keys/private.pem"
JWT_PUBLIC_KEY_PATH="./keys/public.pem"
JWT_ACCESS_TOKEN_EXPIRY="15m"
JWT_REFRESH_TOKEN_EXPIRY="30d"

# ─── AWS S3 ────────────────────────────────────────────
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="adroit-tech-prod"
AWS_CLOUDFRONT_DOMAIN="https://cdn.adroittech.com"

# ─── Email (AWS SES) ───────────────────────────────────
AWS_SES_REGION="ap-south-1"
EMAIL_FROM="careers@adroittech.com"
EMAIL_FROM_NAME="Adroit Tech Services"

# ─── Frontend ──────────────────────────────────────────
FRONTEND_URL="https://career.adroittech.com"
ADMIN_FRONTEND_URL="https://admin.adroittech.com"

# ─── CORS ──────────────────────────────────────────────
CORS_ORIGINS="https://career.adroittech.com,https://admin.adroittech.com"

# ─── Logging ───────────────────────────────────────────
LOG_LEVEL="info"
LOG_FORMAT="json"

# ─── Rate Limiting ─────────────────────────────────────
RATE_LIMIT_GLOBAL_MAX=1000
RATE_LIMIT_AUTH_MAX=10
```

## Config Validation (Zod)

```typescript
// config/index.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV:               z.enum(['development', 'test', 'production']),
  PORT:                   z.string().transform(Number).default('3000'),
  DATABASE_URL:           z.string().url(),
  REDIS_URL:              z.string().url(),
  JWT_PRIVATE_KEY_PATH:   z.string(),
  JWT_PUBLIC_KEY_PATH:    z.string(),
  AWS_REGION:             z.string(),
  AWS_ACCESS_KEY_ID:      z.string(),
  AWS_SECRET_ACCESS_KEY:  z.string(),
  AWS_S3_BUCKET:          z.string(),
  FRONTEND_URL:           z.string().url(),
  EMAIL_FROM:             z.string().email(),
});

// Parse and throw at startup if invalid — fail fast
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const config = _env.data;
```

---

# 11 — Security

## Headers (Helmet)

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'"],
      imgSrc:     ["'self'", 'data:', config.AWS_CLOUDFRONT_DOMAIN],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' },
}));
```

## CORS Configuration

```typescript
// config/cors.config.ts
const allowedOrigins = config.CORS_ORIGINS.split(',');

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials:     true,
  methods:         ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders:  ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders:  ['X-Request-ID', 'X-RateLimit-Remaining'],
  maxAge:          86400,  // Preflight cache 24h
};
```

## Input Sanitization

- All string inputs trimmed and sanitized before DB write
- SQL injection: prevented by Prisma parameterized queries (never raw SQL with user input)
- File uploads: type validation by MIME + magic bytes check (not just extension)
- Passwords: minimum 8 chars, bcrypt rounds 12

## Sensitive Data

- Passwords: bcrypt hashed, never logged, never returned in responses
- PAN card URLs: server-generated signed CloudFront URLs (short TTL), only admin can access
- Refresh tokens: stored as bcrypt hash in DB
- No PII in logs (email/phone masked in debug output)

---

# 12 — Testing Strategy

## Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   ├── jobs.service.test.ts
│   │   └── applications.service.test.ts
│   └── utils/
│       ├── jwt.util.test.ts
│       └── hash.util.test.ts
├── integration/
│   ├── auth.routes.test.ts
│   ├── jobs.routes.test.ts
│   └── applications.routes.test.ts
└── fixtures/
    ├── users.fixture.ts
    ├── jobs.fixture.ts
    └── prisma.mock.ts
```

## Unit Test Pattern

```typescript
// tests/unit/services/jobs.service.test.ts
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { JobsService } from '../../../src/modules/jobs/jobs.service';

describe('JobsService', () => {
  let service: JobsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    service = new JobsService(prismaMock);
  });

  describe('createJob', () => {
    it('should throw ForbiddenError if employer not approved', async () => {
      prismaMock.employerProfile.findUnique.mockResolvedValue({
        status: 'PENDING_APPROVAL',
      } as any);

      await expect(
        service.createJob('userId', createJobDtoFixture)
      ).rejects.toThrow('employer account must be approved');
    });

    it('should create job and return it', async () => {
      // ... happy path test
    });
  });
});
```

## Integration Test Pattern

```typescript
// tests/integration/jobs.routes.test.ts
import supertest from 'supertest';
import { app } from '../../src/app';
import { createTestDb, cleanupTestDb } from '../fixtures/prisma.mock';

describe('POST /api/v1/jobs', () => {
  let employerToken: string;

  beforeAll(async () => {
    await createTestDb();
    employerToken = await getEmployerAuthToken();
  });

  afterAll(() => cleanupTestDb());

  it('returns 403 when employer not approved', async () => {
    const res = await supertest(app)
      .post('/api/v1/jobs')
      .set('Authorization', `Bearer ${employerToken}`)
      .send(createJobDto);

    expect(res.status).toBe(403);
    expect(res.body.errorCode).toBe('EMPLOYER_NOT_APPROVED');
  });
});
```

---

# 13 — Deployment

## Docker

```dockerfile
# docker/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY tsconfig.build.json ./tsconfig.json
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY prisma ./prisma
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## docker-compose.yml (Production)

```yaml
version: '3.9'
services:
  api:
    build:
      context: .
      dockerfile: docker/Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: adroit_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## Graceful Shutdown

```typescript
// server.ts
const server = app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});

const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    await redis.quit();
    logger.info('Server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after 10s timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
```

---

# 14 — Swagger Conventions

## Setup

```typescript
// scripts/generate-swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title:       'Adroit Tech Career API',
      version:     '1.0.0',
      description: 'REST API for Adroit Tech Services Career Portal',
    },
    servers: [
      { url: '/api/v1', description: 'Current version' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type:   'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};
```

## Route JSDoc Example

```typescript
/**
 * @swagger
 * /jobs:
 *   get:
 *     tags: [Jobs]
 *     summary: List active jobs
 *     security: []
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *         description: Filter by city
 *       - in: query
 *         name: salaryMin
 *         schema: { type: integer, minimum: 0 }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of jobs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedJobsResponse'
 */
```
