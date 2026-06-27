import { EmployerProfile, EmployerStatus, Job, JobStatus, Prisma, UserRole } from '@prisma/client';
import { BaseService } from '../../shared/base.service';
import { prisma } from '../../database/prisma';
import { buildPaginatedResponse } from '../../shared/pagination.helper';
import { ForbiddenError, NotFoundError } from '../../shared/errors';
import { CreateJobDto, JobFiltersDto, UpdateJobDto } from './jobs.types';
import { PaginatedResponse } from '../../types/api.types';

export type JobWithEmployerSummary = Job & {
  employer: Pick<EmployerProfile, 'companyName' | 'logoUrl' | 'city'>;
};

export type JobWithFullEmployer = Job & {
  employer: EmployerProfile;
};

export class JobsService extends BaseService {
  constructor() {
    super(prisma);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = this.slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.job.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  async createJob(userId: string, role: UserRole, dto: CreateJobDto): Promise<Job> {
    let employerId: string;

    if (role === UserRole.ADMIN) {
      const employer = await this.prisma.employerProfile.findFirst();
      if (!employer) throw new NotFoundError('No employer profile found to assign job');
      employerId = employer.id;
    } else {
      const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
      if (!employer) throw new NotFoundError('Employer profile not found');
      if (employer.status !== EmployerStatus.APPROVED) {
        throw new ForbiddenError(`Your employer account must be approved before posting jobs. Current status: ${employer.status}`);
      }
      employerId = employer.id;
    }

    const slug = await this.generateUniqueSlug(dto.title);
    const deadlineDate = dto.deadline ? new Date(dto.deadline) : null;

    return this.prisma.job.create({
      data: {
        ...dto,
        deadline: deadlineDate,
        employerId,
        slug,
        status: JobStatus.ACTIVE,
        publishedAt: new Date(),
        createdById: userId,
      },
    });
  }

  async listJobs(filters: JobFiltersDto): Promise<PaginatedResponse<JobWithEmployerSummary>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      salaryMin,
      salaryMax,
      city,
      category,
      type,
      shift,
      experienceLevel,
      isFeatured,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {
      status: JobStatus.ACTIVE,
      deletedAt: null,
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(category && { category: { contains: category, mode: 'insensitive' } }),
      ...(type && { type }),
      ...(shift && { shift }),
      ...(experienceLevel && { experienceLevel }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(salaryMin !== undefined && { salaryMin: { gte: salaryMin } }),
      ...(salaryMax !== undefined && { salaryMax: { lte: salaryMax } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
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
              logoUrl: true,
              city: true,
            },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return buildPaginatedResponse(jobs, total, page, limit);
  }

  async getFeaturedJobs(): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: { status: JobStatus.ACTIVE, isFeatured: true, deletedAt: null },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        employer: {
          select: { companyName: true, logoUrl: true, city: true },
        },
      },
    });
  }

  async getJobByIdOrSlug(idOrSlug: string): Promise<JobWithFullEmployer> {
    const job = await this.prisma.job.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        deletedAt: null,
      },
      include: {
        employer: true,
      },
    });

    if (!job) throw new NotFoundError('Job not found');

    await this.prisma.job.update({
      where: { id: job.id },
      data: { viewCount: { increment: 1 } },
    });

    return job;
  }

  async updateJob(jobId: string, userId: string, role: UserRole, dto: UpdateJobDto): Promise<Job> {
    const job = await this.findOrThrow(
      () => this.prisma.job.findUnique({ where: { id: jobId, deletedAt: null } }),
      'Job'
    );

    if (role !== UserRole.ADMIN) {
      const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
      if (!employer || job.employerId !== employer.id) {
        throw new ForbiddenError('You do not own this job listing');
      }
    }

    const deadlineDate = dto.deadline ? new Date(dto.deadline) : job.deadline;

    return this.prisma.job.update({
      where: { id: jobId },
      data: {
        ...dto,
        deadline: deadlineDate,
        updatedById: userId,
      },
    });
  }

  async updateJobStatus(jobId: string, newStatus: JobStatus, userId: string, role: UserRole): Promise<Job> {
    const job = await this.findOrThrow(
      () => this.prisma.job.findUnique({ where: { id: jobId, deletedAt: null } }),
      'Job'
    );

    if (role !== UserRole.ADMIN) {
      const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
      if (!employer || job.employerId !== employer.id) {
        throw new ForbiddenError('You do not own this job listing');
      }
    }

    const updateData: Partial<Job> = { status: newStatus, updatedById: userId };
    if (newStatus === JobStatus.ACTIVE && !job.publishedAt) updateData.publishedAt = new Date();
    if (newStatus === JobStatus.CLOSED) updateData.closedAt = new Date();

    return this.prisma.job.update({ where: { id: jobId }, data: updateData });
  }

  async softDeleteJob(jobId: string, userId: string, role: UserRole): Promise<void> {
    const job = await this.findOrThrow(
      () => this.prisma.job.findUnique({ where: { id: jobId, deletedAt: null } }),
      'Job'
    );

    if (role !== UserRole.ADMIN) {
      const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
      if (!employer || job.employerId !== employer.id) {
        throw new ForbiddenError('You do not own this job listing');
      }
    }

    await this.prisma.job.update({
      where: { id: jobId },
      data: { deletedAt: new Date(), updatedById: userId },
    });
  }
}
