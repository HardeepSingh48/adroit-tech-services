# 02 — Database Schema (PostgreSQL + Prisma)

## Design Principles

- All tables have `id` (UUID), `created_at`, `updated_at` (audit fields)
- Soft deletes via `deleted_at` on critical entities (users, jobs)
- `created_by_id` / `updated_by_id` on mutable records
- Indexed foreign keys, indexed search fields
- Enum types defined at DB level (not just app level)
- No nullable foreign keys where a record must always belong to a parent

---

## Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum UserRole {
  JOB_SEEKER
  EMPLOYER
  ADMIN
}

enum UserStatus {
  PENDING_VERIFICATION
  ACTIVE
  SUSPENDED
  DEACTIVATED
}

enum EmployerStatus {
  PENDING_APPROVAL
  APPROVED
  REJECTED
  SUSPENDED
}

enum JobStatus {
  DRAFT
  ACTIVE
  CLOSED
  ARCHIVED
}

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
}

enum ShiftType {
  DAY
  NIGHT
  ROTATIONAL
}

enum ExperienceLevel {
  FRESHER
  ZERO_TO_ONE
  ONE_TO_THREE
  THREE_PLUS
}

enum ApplicationStatus {
  SUBMITTED
  UNDER_REVIEW
  SHORTLISTED
  INTERVIEWED
  HIRED
  REJECTED
  WITHDRAWN
}

enum DocumentType {
  RESUME
  PHOTO
  PAN_CARD
  AADHAR_CARD
  COMPANY_LOGO
  EXPERIENCE_LETTER
  OTHER
}

enum NotificationType {
  APPLICATION_SUBMITTED
  APPLICATION_SHORTLISTED
  APPLICATION_REJECTED
  APPLICATION_HIRED
  JOB_POSTED
  ACCOUNT_VERIFIED
  PASSWORD_RESET
}

// ─────────────────────────────────────────────
// CORE USER TABLE
// ─────────────────────────────────────────────

model User {
  id                String      @id @default(uuid())
  email             String?     @unique
  phone             String?     @unique
  passwordHash      String
  role              UserRole
  status            UserStatus  @default(PENDING_VERIFICATION)
  emailVerifiedAt   DateTime?
  phoneVerifiedAt   DateTime?
  lastLoginAt       DateTime?
  loginCount        Int         @default(0)
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  deletedAt         DateTime?

  // Relations
  jobSeekerProfile  JobSeekerProfile?
  employerProfile   EmployerProfile?
  refreshTokens     RefreshToken[]
  notifications     Notification[]
  auditLogs         AuditLog[]

  @@index([email])
  @@index([phone])
  @@index([role])
  @@index([status])
  @@index([deletedAt])
  @@map("users")
}

// ─────────────────────────────────────────────
// AUTH TOKENS
// ─────────────────────────────────────────────

model RefreshToken {
  id          String    @id @default(uuid())
  token       String    @unique       // Hashed token stored
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  deviceInfo  String?                 // User-Agent snippet
  ipAddress   String?
  expiresAt   DateTime
  revokedAt   DateTime?
  createdAt   DateTime  @default(now())

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("refresh_tokens")
}

// ─────────────────────────────────────────────
// JOB SEEKER PROFILE
// ─────────────────────────────────────────────

model JobSeekerProfile {
  id                String           @id @default(uuid())
  userId            String           @unique
  user              User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName          String
  dateOfBirth       DateTime?
  gender            String?
  preferredCity     String?
  currentAddress    String?
  experience        ExperienceLevel  @default(FRESHER)
  photoUrl          String?          // S3 URL
  resumeUrl         String?          // S3 URL
  bio               String?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  createdById       String?
  updatedById       String?

  // Relations
  applications      Application[]
  savedJobs         SavedJob[]

  @@index([userId])
  @@index([preferredCity])
  @@index([experience])
  @@map("job_seeker_profiles")
}

// ─────────────────────────────────────────────
// EMPLOYER PROFILE
// ─────────────────────────────────────────────

model EmployerProfile {
  id              String           @id @default(uuid())
  userId          String           @unique
  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyName     String
  contactPerson   String
  industry        String
  companySize     String
  address         String
  city            String
  state           String           @default("Delhi NCR")
  pincode         String?
  gstNumber       String?
  panNumber       String?
  website         String?
  logoUrl         String?          // S3 URL
  panCardUrl      String?          // S3 URL (admin access only)
  status          EmployerStatus   @default(PENDING_APPROVAL)
  approvedAt      DateTime?
  approvedById    String?          // Admin user ID
  rejectedAt      DateTime?
  rejectionReason String?
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  createdById     String?
  updatedById     String?

  // Relations
  jobs            Job[]

  @@index([userId])
  @@index([status])
  @@index([industry])
  @@index([city])
  @@map("employer_profiles")
}

// ─────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────

model Job {
  id               String           @id @default(uuid())
  employerId       String
  employer         EmployerProfile  @relation(fields: [employerId], references: [id], onDelete: Restrict)
  title            String
  slug             String           @unique
  category         String
  description      String
  responsibilities String[]         // PostgreSQL array
  requirements     String[]
  benefits         String[]
  type             JobType
  shift            ShiftType
  experienceLevel  ExperienceLevel
  city             String
  address          String
  salaryMin        Int
  salaryMax        Int
  positions        Int              @default(1)
  ageMin           Int?
  ageMax           Int?
  education        String?
  status           JobStatus        @default(DRAFT)
  isFeatured       Boolean          @default(false)
  deadline         DateTime?
  viewCount        Int              @default(0)
  applicationCount Int              @default(0)
  publishedAt      DateTime?
  closedAt         DateTime?
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
  deletedAt        DateTime?
  createdById      String
  updatedById      String?

  // Relations
  applications     Application[]
  savedBy          SavedJob[]

  @@index([employerId])
  @@index([status])
  @@index([city])
  @@index([category])
  @@index([type])
  @@index([shift])
  @@index([experienceLevel])
  @@index([isFeatured])
  @@index([salaryMin, salaryMax])
  @@index([deadline])
  @@index([deletedAt])
  @@index([slug])
  @@map("jobs")
}

// ─────────────────────────────────────────────
// APPLICATIONS
// ─────────────────────────────────────────────

model Application {
  id                String             @id @default(uuid())
  jobId             String
  job               Job                @relation(fields: [jobId], references: [id], onDelete: Restrict)
  jobSeekerId       String
  jobSeeker         JobSeekerProfile   @relation(fields: [jobSeekerId], references: [id], onDelete: Restrict)
  status            ApplicationStatus  @default(SUBMITTED)
  coverNote         String?
  availability      String             // "immediate", "1-week", etc.
  resumeUrl         String?            // Snapshot at time of application
  photoUrl          String?
  experienceNote    String?
  employerNotes     String?            // Internal notes by employer (not visible to seeker)
  statusHistory     ApplicationStatusHistory[]
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  withdrawnAt       DateTime?
  createdById       String?
  updatedById       String?

  // Prevent duplicate applications
  @@unique([jobId, jobSeekerId])
  @@index([jobId])
  @@index([jobSeekerId])
  @@index([status])
  @@index([createdAt])
  @@map("applications")
}

model ApplicationStatusHistory {
  id              String             @id @default(uuid())
  applicationId   String
  application     Application        @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  fromStatus      ApplicationStatus?
  toStatus        ApplicationStatus
  changedById     String             // User who made the change
  reason          String?
  createdAt       DateTime           @default(now())

  @@index([applicationId])
  @@map("application_status_history")
}

// ─────────────────────────────────────────────
// SAVED JOBS
// ─────────────────────────────────────────────

model SavedJob {
  id          String           @id @default(uuid())
  jobSeekerId String
  jobSeeker   JobSeekerProfile @relation(fields: [jobSeekerId], references: [id], onDelete: Cascade)
  jobId       String
  job         Job              @relation(fields: [jobId], references: [id], onDelete: Cascade)
  createdAt   DateTime         @default(now())

  @@unique([jobSeekerId, jobId])
  @@index([jobSeekerId])
  @@map("saved_jobs")
}

// ─────────────────────────────────────────────
// DOCUMENTS (S3 metadata)
// ─────────────────────────────────────────────

model Document {
  id           String       @id @default(uuid())
  userId       String
  type         DocumentType
  fileName     String
  originalName String
  mimeType     String
  sizeBytes    Int
  s3Key        String       @unique
  s3Bucket     String
  url          String
  isVerified   Boolean      @default(false)
  verifiedAt   DateTime?
  verifiedById String?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  @@index([userId])
  @@index([type])
  @@map("documents")
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────

model Notification {
  id        String           @id @default(uuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      NotificationType
  title     String
  body      String
  metadata  Json?            // Extra context (jobId, applicationId, etc.)
  isRead    Boolean          @default(false)
  readAt    DateTime?
  createdAt DateTime         @default(now())

  @@index([userId, isRead])
  @@index([createdAt])
  @@map("notifications")
}

// ─────────────────────────────────────────────
// AUDIT LOG
// ─────────────────────────────────────────────

model AuditLog {
  id           String   @id @default(uuid())
  userId       String?
  user         User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  action       String   // "JOB_CREATED", "USER_SUSPENDED", etc.
  resource     String   // "Job", "User", "Application"
  resourceId   String?
  metadata     Json?    // Before/after snapshot for updates
  ipAddress    String?
  userAgent    String?
  createdAt    DateTime @default(now())

  @@index([userId])
  @@index([action])
  @@index([resource, resourceId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## Entity Relationship Summary

```
User (1) ──────────── (1) JobSeekerProfile
User (1) ──────────── (1) EmployerProfile
User (1) ──────────── (N) RefreshToken
User (1) ──────────── (N) Notification
User (1) ──────────── (N) AuditLog

EmployerProfile (1) ─ (N) Job
JobSeekerProfile (1) ─(N) Application
Job (1) ─────────────(N) Application
Application (1) ──── (N) ApplicationStatusHistory

JobSeekerProfile (N) ─(N) Job  [via SavedJob]
```

---

## Key Design Decisions

### Why PostgreSQL arrays for `responsibilities`, `requirements`, `benefits`?
These are ordered, short lists that are always fetched with the job. No need for a separate junction table. Prisma supports `String[]` natively on PostgreSQL.

### Why UUID primary keys?
Avoids sequential ID enumeration attacks, safe for distributed inserts, consistent across environments.

### Why soft deletes on `User` and `Job`?
Regulatory requirement: maintain data for active applications even if employer deletes their account. Application records must stay intact.

### Why `ApplicationStatusHistory`?
Full audit trail of who changed what and when. Critical for dispute resolution and employer accountability.

### Why denormalize `applicationCount` on `Job`?
Avoids expensive COUNT queries on the dashboard. Maintained via application insert/delete triggers at the service layer.

---

## Database Indexes Strategy

| Query Pattern | Index |
|---|---|
| Auth: find user by email | `users.email` |
| Auth: find user by phone | `users.phone` |
| Jobs: filter by city | `jobs.city` |
| Jobs: filter by category | `jobs.category` |
| Jobs: featured jobs | `jobs.is_featured` |
| Jobs: salary range | `jobs.(salary_min, salary_max)` |
| Jobs: search by employer | `jobs.employer_id` |
| Applications: by job | `applications.job_id` |
| Applications: by seeker | `applications.job_seeker_id` |
| Applications: by status | `applications.status` |
| Tokens: lookup & expire | `refresh_tokens.(token, expires_at)` |

---

## Migrations Workflow

```bash
# Create a migration
npx prisma migrate dev --name add_job_fields

# Apply in production
npx prisma migrate deploy

# Seed dev data
npx prisma db seed

# Reset dev DB
npx prisma migrate reset
```
