# 06 — Services Layer Design

## Philosophy

Controllers are dumb dispatchers. Services own **all** business logic. Services are independently testable with mocked Prisma and Redis clients. Services throw typed `AppError` instances — never raw strings.

---

## Base Service

```typescript
// shared/base.service.ts
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from './errors';

export abstract class BaseService {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Throws NotFoundError if record doesn't exist.
   * Subclasses pass their own prisma delegate and label.
   */
  protected async findOrThrow<T>(
    findFn: () => Promise<T | null>,
    label: string
  ): Promise<T> {
    const record = await findFn();
    if (!record) throw new NotFoundError(`${label} not found`);
    return record;
  }
}
```

---

## Auth Service

```typescript
// modules/auth/auth.service.ts

interface RegisterJobSeekerDto {
  fullName:      string;
  phone?:        string;
  email?:        string;
  password:      string;
  preferredCity: string;
  experience:    ExperienceLevel;
}

interface RegisterEmployerDto {
  companyName:   string;
  contactPerson: string;
  email:         string;
  phone:         string;
  password:      string;
  industry:      string;
  companySize:   string;
  address:       string;
  city:          string;
  gstNumber?:    string;
  panNumber?:    string;
}

interface LoginDto {
  identifier: string;    // email or phone
  password:   string;
}

class AuthService extends BaseService {

  async registerJobSeeker(dto: RegisterJobSeekerDto): Promise<TokenPair & { user: SafeUser }> {
    // 1. Check uniqueness (email + phone)
    await this.assertUniqueCredentials(dto.email, dto.phone);
    
    // 2. Hash password
    const passwordHash = await hashPassword(dto.password);
    
    // 3. Create User + JobSeekerProfile in transaction
    const { user, profile } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          phone: dto.phone,
          passwordHash,
          role: UserRole.JOB_SEEKER,
          status: UserStatus.PENDING_VERIFICATION,
        },
      });

      const profile = await tx.jobSeekerProfile.create({
        data: {
          userId:       user.id,
          fullName:     dto.fullName,
          preferredCity: dto.preferredCity,
          experience:   dto.experience,
          createdById:  user.id,
        },
      });

      return { user, profile };
    });
    
    // 4. Generate tokens
    const tokenPair = await this.createTokenPair(user.id, user.role, null);
    
    // 5. Queue verification email
    await emailQueue.add('send-verification', {
      userId: user.id,
      email: dto.email,
      name: dto.fullName,
    });
    
    // 6. Audit log
    await this.createAuditLog(user.id, 'USER_REGISTERED', 'User', user.id);
    
    return { ...tokenPair, user: sanitizeUser(user) };
  }

  async login(dto: LoginDto): Promise<TokenPair & { user: SafeUser }> {
    // 1. Find user by email OR phone
    const user = await this.findUserByIdentifier(dto.identifier);
    
    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenError('Your account has been suspended. Contact support.');
    }
    if (user.status === UserStatus.DEACTIVATED) {
      throw new ForbiddenError('Your account has been deactivated.');
    }
    
    // 2. Verify password
    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');
    
    // 3. Update login stats
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), loginCount: { increment: 1 } },
    });
    
    // 4. Generate tokens
    const tokenPair = await this.createTokenPair(user.id, user.role, null);
    
    return { ...tokenPair, user: sanitizeUser(user) };
  }

  async refreshTokens(rawRefreshToken: string): Promise<TokenPair> {
    // 1. Verify signature
    const payload = verifyRefreshToken(rawRefreshToken);
    
    // 2. Look up session in DB
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        userId:    payload.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
    
    // 3. Compare hashed token
    if (!tokenRecord || !(await compareHash(rawRefreshToken, tokenRecord.token))) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    
    // 4. Revoke old token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data:  { revokedAt: new Date() },
    });
    
    // 5. Issue new pair
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedError('User not found');
    
    return this.createTokenPair(user.id, user.role, null);
  }

  async logout(userId: string, rawRefreshToken: string, sessionId: string): Promise<void> {
    // Revoke refresh token in DB
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      // In production, match specific token by hash for precision
      data:  { revokedAt: new Date() },
    });
    
    // Blacklist access token session in Redis (until AT expiry)
    const ACCESS_TOKEN_EXPIRY_SECONDS = 15 * 60;
    await redis.setEx(`revoked:session:${sessionId}`, ACCESS_TOKEN_EXPIRY_SECONDS, '1');
  }

  private async createTokenPair(
    userId: string,
    role: UserRole,
    deviceInfo: string | null,
  ): Promise<TokenPair> {
    const sessionId = uuidv4();
    
    const accessToken  = signAccessToken({ sub: userId, role, sessionId });
    const refreshToken = signRefreshToken({ sub: userId, sessionId });
    
    const expiresAt = addDays(new Date(), 30);
    
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token:      await hashToken(refreshToken),   // Store hash, not raw
        sessionId,
        deviceInfo,
        expiresAt,
      },
    });
    
    return { accessToken, refreshToken };
  }
}
```

---

## Jobs Service

```typescript
// modules/jobs/jobs.service.ts

interface CreateJobDto {
  title:           string;
  category:        string;
  description:     string;
  responsibilities: string[];
  requirements:    string[];
  benefits:        string[];
  type:            JobType;
  shift:           ShiftType;
  experienceLevel: ExperienceLevel;
  city:            string;
  address:         string;
  salaryMin:       number;
  salaryMax:       number;
  positions:       number;
  ageMin?:         number;
  ageMax?:         number;
  education?:      string;
  deadline?:       string;
}

interface JobFiltersDto {
  city?:            string;
  category?:        string;
  type?:            JobType;
  shift?:           ShiftType;
  experienceLevel?: ExperienceLevel;
  salaryMin?:       number;
  salaryMax?:       number;
  isFeatured?:      boolean;
  search?:          string;
  page?:            number;
  limit?:           number;
  sortBy?:          string;
  sortOrder?:       'asc' | 'desc';
}

class JobsService extends BaseService {

  async createJob(
    employerUserId: string,
    dto: CreateJobDto
  ): Promise<Job> {
    // 1. Get employer profile
    const employer = await this.findEmployerByUserId(employerUserId);

    // 2. Verify employer is approved
    if (employer.status !== EmployerStatus.APPROVED) {
      throw new ForbiddenError(
        'Your employer account must be approved before posting jobs. ' +
        'Current status: ' + employer.status
      );
    }

    // 3. Generate unique slug
    const slug = await this.generateUniqueSlug(dto.title);

    // 4. Create job
    const job = await this.prisma.job.create({
      data: {
        ...dto,
        employerId:  employer.id,
        slug,
        status:      JobStatus.DRAFT,
        createdById: employerUserId,
      },
    });

    // 5. Audit
    await this.createAuditLog(employerUserId, 'JOB_CREATED', 'Job', job.id, dto);

    return job;
  }

  async listJobs(filters: JobFiltersDto): Promise<PaginatedResponse<Job>> {
    const {
      page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc',
      search, salaryMin, salaryMax, ...restFilters
    } = filters;

    const skip = (page - 1) * limit;

    // Build Prisma where clause
    const where: Prisma.JobWhereInput = {
      status:    JobStatus.ACTIVE,
      deletedAt: null,
      ...restFilters,
      ...(salaryMin && { salaryMin: { gte: salaryMin } }),
      ...(salaryMax && { salaryMax: { lte: salaryMax } }),
      ...(search && {
        OR: [
          { title:       { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { city:        { contains: search, mode: 'insensitive' } },
          { category:    { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          employer: {
            select: {
              companyName: true,
              logoUrl:     true,
              city:        true,
            },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return buildPaginatedResponse(jobs, total, page, limit);
  }

  async updateJobStatus(
    jobId: string,
    newStatus: JobStatus,
    userId: string,
    role: UserRole,
  ): Promise<Job> {
    const job = await this.findOrThrow(
      () => this.prisma.job.findUnique({ where: { id: jobId, deletedAt: null } }),
      'Job'
    );

    // Ownership check
    if (role !== UserRole.ADMIN) {
      const employer = await this.findEmployerByUserId(userId);
      if (job.employerId !== employer.id) {
        throw new ForbiddenError('You do not own this job listing');
      }
    }

    // Valid transitions
    const validTransitions: Record<JobStatus, JobStatus[]> = {
      DRAFT:    [JobStatus.ACTIVE],
      ACTIVE:   [JobStatus.CLOSED],
      CLOSED:   [JobStatus.ACTIVE, JobStatus.ARCHIVED],
      ARCHIVED: [],
    };

    if (!validTransitions[job.status].includes(newStatus)) {
      throw new UnprocessableEntityError(
        `Cannot transition job from ${job.status} to ${newStatus}`
      );
    }

    const updateData: Partial<Job> = {
      status:     newStatus,
      updatedById: userId,
    };

    if (newStatus === JobStatus.ACTIVE && !job.publishedAt) {
      updateData.publishedAt = new Date();
    }
    if (newStatus === JobStatus.CLOSED) {
      updateData.closedAt = new Date();
    }

    return this.prisma.job.update({ where: { id: jobId }, data: updateData });
  }
}
```

---

## Applications Service

```typescript
// modules/applications/applications.service.ts

class ApplicationsService extends BaseService {

  async applyForJob(
    jobSeekerUserId: string,
    jobId:           string,
    dto:             ApplyForJobDto,
  ): Promise<Application> {
    // 1. Get job seeker profile
    const seeker = await this.findJobSeekerByUserId(jobSeekerUserId);

    // 2. Get job — must be ACTIVE
    const job = await this.findOrThrow(
      () => this.prisma.job.findUnique({
        where: { id: jobId, status: JobStatus.ACTIVE, deletedAt: null }
      }),
      'Job'
    );

    // 3. Check deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      throw new UnprocessableEntityError('Application deadline has passed');
    }

    // 4. Check duplicate application (unique constraint also handles this)
    const existing = await this.prisma.application.findUnique({
      where: { jobId_jobSeekerId: { jobId, jobSeekerId: seeker.id } },
    });
    if (existing) {
      if (existing.withdrawnAt) {
        throw new ConflictError('You have previously withdrawn this application');
      }
      throw new ConflictError('You have already applied for this job');
    }

    // 5. Create application + update job counter in transaction
    const application = await this.prisma.$transaction(async (tx) => {
      const app = await tx.application.create({
        data: {
          jobId:          job.id,
          jobSeekerId:    seeker.id,
          availability:   dto.availability,
          coverNote:      dto.coverNote,
          experienceNote: dto.experienceNote,
          resumeUrl:      seeker.resumeUrl,
          photoUrl:       seeker.photoUrl,
          createdById:    jobSeekerUserId,
        },
      });

      // Update denormalized counter
      await tx.job.update({
        where: { id: jobId },
        data:  { applicationCount: { increment: 1 } },
      });

      // Record status history
      await tx.applicationStatusHistory.create({
        data: {
          applicationId: app.id,
          fromStatus:    null,
          toStatus:      ApplicationStatus.SUBMITTED,
          changedById:   jobSeekerUserId,
        },
      });

      return app;
    });

    // 6. Notify employer
    await this.notifyEmployer(job, seeker, application);

    // 7. Notify applicant (confirmation)
    await this.notifyApplicant(seeker, job, application);

    return application;
  }

  async updateApplicationStatus(
    applicationId: string,
    newStatus:     ApplicationStatus,
    employerUserId: string,
    reason?:        string,
  ): Promise<Application> {
    const application = await this.findOrThrow(
      () => this.prisma.application.findUnique({
        where: { id: applicationId },
        include: { job: true },
      }),
      'Application'
    );

    // Verify employer owns the job
    const employer = await this.findEmployerByUserId(employerUserId);
    if (application.job.employerId !== employer.id) {
      throw new ForbiddenError('You cannot update this application');
    }

    // Valid status transitions
    const VALID_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
      SUBMITTED:      [ApplicationStatus.UNDER_REVIEW, ApplicationStatus.REJECTED],
      UNDER_REVIEW:   [ApplicationStatus.SHORTLISTED, ApplicationStatus.REJECTED],
      SHORTLISTED:    [ApplicationStatus.INTERVIEWED, ApplicationStatus.REJECTED],
      INTERVIEWED:    [ApplicationStatus.HIRED, ApplicationStatus.REJECTED],
      HIRED:          [],
      REJECTED:       [],
      WITHDRAWN:      [],
    };

    if (!VALID_TRANSITIONS[application.status].includes(newStatus)) {
      throw new UnprocessableEntityError(
        `Cannot change status from ${application.status} to ${newStatus}`
      );
    }

    // Update in transaction with history record
    const updated = await this.prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id: applicationId },
        data:  { status: newStatus, updatedById: employerUserId },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          fromStatus:  application.status,
          toStatus:    newStatus,
          changedById: employerUserId,
          reason,
        },
      });

      return app;
    });

    // Notify job seeker of status change
    await this.notifyApplicantStatusChange(application, newStatus);

    return updated;
  }
}
```

---

## Error Hierarchy

```typescript
// shared/errors.ts

export class AppError extends Error {
  constructor(
    public readonly message:    string,
    public readonly statusCode: number,
    public readonly errorCode:  string,
    public readonly errors?:    Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError      extends AppError {
  constructor(message: string, errors?: any[]) {
    super(message, 400, 'VALIDATION_ERROR', errors);
  }
}

export class UnauthorizedError    extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError       extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError        extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError        extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string) {
    super(message, 422, 'UNPROCESSABLE_ENTITY');
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'TOO_MANY_REQUESTS');
  }
}

export class InternalServerError  extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}
```

---

## Controller Pattern

```typescript
// modules/jobs/jobs.controller.ts
import { RequestHandler } from 'express';
import { JobsService } from './jobs.service';
import { sendSuccess, sendPaginated } from '../../shared/response.helper';

export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  listJobs: RequestHandler = async (req, res, next) => {
    try {
      const result = await this.jobsService.listJobs(req.query as any);
      sendPaginated(res, result, 'Jobs retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  createJob: RequestHandler = async (req, res, next) => {
    try {
      const job = await this.jobsService.createJob(req.user!.id, req.body);
      sendSuccess(res, job, 'Job created successfully', 201);
    } catch (err) {
      next(err);
    }
  };
}
```

---

## Response Helper

```typescript
// shared/response.helper.ts
import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200,
) => {
  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

export const sendPaginated = (
  res: Response,
  result: { data: unknown[]; meta: object },
  message = 'Success',
) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message,
    data: result.data,
    meta: result.meta,
  });
};
```
