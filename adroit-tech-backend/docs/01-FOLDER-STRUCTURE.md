# 01 — Folder Structure

## Root Layout

```
adroit-backend/
├── src/
│   ├── config/
│   ├── constants/
│   ├── database/
│   ├── modules/
│   ├── middleware/
│   ├── shared/
│   ├── jobs/                    # BullMQ workers
│   ├── utils/
│   ├── types/
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── docker/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── nginx/
│       └── nginx.conf
├── docs/
│   └── swagger.yaml             # Auto-generated
├── scripts/
│   ├── seed-dev.ts
│   └── generate-swagger.ts
├── .env.example
├── .env.development
├── docker-compose.yml
├── docker-compose.dev.yml
├── jest.config.ts
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── README.md
```

---

## `src/` Deep Dive

```
src/
│
├── app.ts                        # Express app factory (no listen here)
├── server.ts                     # HTTP server + graceful shutdown
│
├── config/
│   ├── index.ts                  # Aggregates all config, validates with Zod
│   ├── database.config.ts        # Prisma client singleton
│   ├── redis.config.ts           # Redis client singleton
│   ├── s3.config.ts              # AWS S3 client
│   ├── bull.config.ts            # BullMQ queue definitions
│   ├── email.config.ts           # Nodemailer transporter
│   └── logger.config.ts          # Winston logger instance
│
├── constants/
│   ├── roles.constants.ts        # USER_ROLES enum
│   ├── status.constants.ts       # Application/Job status enums
│   ├── error-codes.constants.ts  # APP_ERROR_CODES enum
│   └── cache-keys.constants.ts   # Redis key templates
│
├── database/
│   └── prisma.ts                 # Prisma client export (singleton)
│
├── types/
│   ├── express.d.ts              # Augment Request with user, requestId
│   ├── auth.types.ts             # JWTPayload, TokenPair, etc.
│   ├── api.types.ts              # ApiResponse<T>, PaginatedResponse<T>
│   ├── upload.types.ts           # UploadedFile, S3UploadResult
│   └── common.types.ts           # Shared utility types
│
├── middleware/
│   ├── auth.middleware.ts         # JWT verification, attach req.user
│   ├── rbac.middleware.ts         # Role-based access control
│   ├── validate.middleware.ts     # Zod schema validation factory
│   ├── upload.middleware.ts       # Multer + S3 upload handling
│   ├── rateLimiter.middleware.ts  # Express-rate-limit configurations
│   ├── requestId.middleware.ts    # UUID per request for tracing
│   ├── errorHandler.middleware.ts # Global error handler
│   └── notFound.middleware.ts     # 404 handler
│
├── shared/
│   ├── base.service.ts           # Abstract base with common patterns
│   ├── pagination.helper.ts      # Cursor/offset pagination utilities
│   └── response.helper.ts        # Standard ApiResponse builder
│
├── utils/
│   ├── jwt.util.ts               # Sign/verify access & refresh tokens
│   ├── hash.util.ts              # bcrypt helpers
│   ├── date.util.ts              # Date formatting utilities
│   ├── string.util.ts            # Slug generation, sanitization
│   ├── file.util.ts              # MIME type check, size validation
│   └── otp.util.ts               # OTP generation (future phone auth)
│
├── jobs/                         # BullMQ Processors
│   ├── queues/
│   │   ├── email.queue.ts
│   │   └── notification.queue.ts
│   ├── processors/
│   │   ├── email.processor.ts    # Sends emails via SES
│   │   └── notification.processor.ts
│   └── index.ts                  # Register all workers
│
└── modules/                      # Feature modules (domain-driven)
    ├── auth/
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.routes.ts
    │   ├── auth.schema.ts        # Zod validation schemas
    │   └── auth.types.ts
    │
    ├── users/
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   ├── users.routes.ts
    │   ├── users.schema.ts
    │   └── users.types.ts
    │
    ├── job-seekers/
    │   ├── job-seekers.controller.ts
    │   ├── job-seekers.service.ts
    │   ├── job-seekers.routes.ts
    │   ├── job-seekers.schema.ts
    │   └── job-seekers.types.ts
    │
    ├── employers/
    │   ├── employers.controller.ts
    │   ├── employers.service.ts
    │   ├── employers.routes.ts
    │   ├── employers.schema.ts
    │   └── employers.types.ts
    │
    ├── jobs/
    │   ├── jobs.controller.ts
    │   ├── jobs.service.ts
    │   ├── jobs.routes.ts
    │   ├── jobs.schema.ts
    │   └── jobs.types.ts
    │
    ├── applications/
    │   ├── applications.controller.ts
    │   ├── applications.service.ts
    │   ├── applications.routes.ts
    │   ├── applications.schema.ts
    │   └── applications.types.ts
    │
    ├── admin/
    │   ├── admin.controller.ts
    │   ├── admin.service.ts
    │   ├── admin.routes.ts
    │   ├── admin.schema.ts
    │   └── admin.types.ts
    │
    └── uploads/
        ├── uploads.controller.ts
        ├── uploads.service.ts
        ├── uploads.routes.ts
        └── uploads.types.ts
```

---

## Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Files | `kebab-case.type.ts` | `auth.service.ts` |
| Classes | `PascalCase` | `AuthService` |
| Interfaces | `IPascalCase` | `IAuthService` |
| Types | `TPascalCase` | `TJwtPayload` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_FILE_SIZE_MB` |
| Functions | `camelCase` | `generateTokenPair` |
| Variables | `camelCase` | `accessToken` |
| DB Tables | `snake_case` | `job_applications` |
| Env vars | `SCREAMING_SNAKE_CASE` | `DATABASE_URL` |
| Routes | `kebab-case` | `/job-seekers/:id` |
| Zod schemas | `camelCase + Schema` | `registerJobSeekerSchema` |

---

## Module Anatomy

Every module follows the same internal structure:

```
Controller  →  validates request, calls Service, returns ApiResponse
Service     →  business logic, calls Prisma, throws AppError
Routes      →  registers paths, applies middleware, points to controller
Schema      →  Zod schemas for body/params/query validation
Types       →  module-specific TypeScript types/interfaces
```

Controllers are **thin** — no business logic. Services are **rich** — all logic lives here and is independently testable.
