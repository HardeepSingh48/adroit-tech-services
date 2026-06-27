# Adroit Tech Services — Backend Architecture Overview

## Project Summary

A production-grade REST API backend for the Adroit Tech Services career portal — a security staffing platform serving Delhi NCR. The system supports two primary user roles: **Job Seekers** (candidates applying for security positions) and **Employers** (companies posting jobs). An **Admin** role manages the platform.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Runtime | Node.js 20 LTS | Stable, LTS support, async-first |
| Framework | Express.js 4.x | Lightweight, well-understood, vast ecosystem |
| Language | TypeScript 5.x | Type safety, maintainability, better DX |
| Primary DB | PostgreSQL 16 | Relational data, ACID, strong typing, JSON support |
| ORM | Prisma | Type-safe queries, migrations, schema as source of truth |
| Cache / Sessions | Redis 7 | Token blacklisting, rate limit counters, job search cache |
| File Storage | AWS S3 + CloudFront | Resumes, photos, company logos, PAN cards |
| Auth | JWT (Access + Refresh tokens) | Stateless, scalable, RBAC-friendly |
| API Docs | Swagger / OpenAPI 3.0 | Auto-generated from decorators |
| Validation | Zod | Runtime schema validation, type inference |
| Email | Nodemailer + SES | Transactional emails |
| Job Queue | BullMQ (Redis-backed) | Async email, file processing |
| Logging | Winston + Morgan | Structured JSON logs |
| Testing | Jest + Supertest | Unit + Integration tests |
| Process Manager | PM2 | Clustering, zero-downtime restarts |
| Container | Docker + Docker Compose | Dev parity, production deployment |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│              React SPA (Vite + TypeScript)                   │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────────┐
│                      GATEWAY LAYER                           │
│         Nginx (Reverse Proxy + SSL Termination)              │
│         Rate Limiting | CORS | Static Assets                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    APPLICATION LAYER                          │
│                Express.js API Server                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Middleware Pipeline                      │   │
│  │  helmet → cors → morgan → rateLimit → auth → rbac   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │
│  │  Auth   │ │  Jobs   │ │  Apps   │ │    Employers     │  │
│  │ Router  │ │ Router  │ │ Router  │ │     Router       │  │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────────┬────────┘  │
│       └───────────┴───────────┴────────────────┘            │
│                       Service Layer                          │
│       ┌──────────────────────────────────────┐              │
│       │         Business Logic / Services     │              │
│       └──────────────────┬───────────────────┘              │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌─────────────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │  PostgreSQL 16   │  │ Redis 7  │  │    AWS S3          │ │
│  │  (Primary Store) │  │ (Cache)  │  │  (File Storage)    │ │
│  └─────────────────┘  └──────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   BACKGROUND WORKERS                         │
│              BullMQ (Email, File Processing)                 │
│              Cron Jobs (Token cleanup, stats)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Document Index

| # | Document | Description |
|---|---|---|
| 01 | `01-FOLDER-STRUCTURE.md` | Complete project directory layout |
| 02 | `02-DATABASE-SCHEMA.md` | PostgreSQL schema, relationships, indexes |
| 03 | `03-AUTH-SYSTEM.md` | JWT, refresh tokens, RBAC, token lifecycle |
| 04 | `04-API-ROUTES.md` | All REST endpoints with methods, auth, payloads |
| 05 | `05-MIDDLEWARE.md` | All middleware — auth, RBAC, validation, error handling |
| 06 | `06-SERVICES.md` | Business logic layer design |
| 07 | `07-FILE-UPLOAD.md` | S3 upload strategy, signed URLs, validation |
| 08 | `08-CACHING-STRATEGY.md` | Redis caching patterns |
| 09 | `09-ERROR-HANDLING.md` | Global error handler, error codes, response format |
| 10 | `10-ENVIRONMENT-CONFIG.md` | All env vars, config management |
| 11 | `11-SECURITY.md` | Security checklist, headers, rate limiting |
| 12 | `12-TESTING-STRATEGY.md` | Unit, integration, e2e test setup |
| 13 | `13-DEPLOYMENT.md` | Docker, PM2, CI/CD pipeline |
| 14 | `14-SWAGGER-CONVENTIONS.md` | OpenAPI documentation standards |
