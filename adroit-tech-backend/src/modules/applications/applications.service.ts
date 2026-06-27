import { Application, ApplicationStatus, JobStatus, UserRole } from '@prisma/client';
import { BaseService } from '../../shared/base.service';
import { prisma } from '../../database/prisma';
import { ConflictError, ForbiddenError, NotFoundError, UnprocessableEntityError } from '../../shared/errors';
import { ApplyForJobDto, UpdateApplicationStatusDto, AddEmployerNotesDto } from './applications.types';

export class ApplicationsService extends BaseService {
  constructor() {
    super(prisma);
  }

  async applyForJob(userId: string, jobId: string, dto: ApplyForJobDto): Promise<Application> {
    const seeker = await this.prisma.jobSeekerProfile.findUnique({ where: { userId } });
    if (!seeker) throw new NotFoundError('Job seeker profile not found');

    const job = await this.findOrThrow(
      () => this.prisma.job.findUnique({ where: { id: jobId, status: JobStatus.ACTIVE, deletedAt: null } }),
      'Job'
    );

    if (job.deadline && new Date(job.deadline) < new Date()) {
      throw new UnprocessableEntityError('Application deadline has passed');
    }

    const existing = await this.prisma.application.findUnique({
      where: { jobId_jobSeekerId: { jobId, jobSeekerId: seeker.id } },
    });
    if (existing) {
      if (existing.withdrawnAt) throw new ConflictError('You have previously withdrawn this application');
      throw new ConflictError('You have already applied for this job');
    }

    return this.prisma.$transaction(async (tx) => {
      const app = await tx.application.create({
        data: {
          jobId: job.id,
          jobSeekerId: seeker.id,
          availability: dto.availability,
          coverNote: dto.coverNote,
          experienceNote: dto.experienceNote,
          resumeUrl: seeker.resumeUrl,
          photoUrl: seeker.photoUrl,
          createdById: userId,
        },
      });

      await tx.job.update({
        where: { id: jobId },
        data: { applicationCount: { increment: 1 } },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: app.id,
          fromStatus: null,
          toStatus: ApplicationStatus.SUBMITTED,
          changedById: userId,
        },
      });

      return app;
    });
  }

  async updateApplicationStatus(applicationId: string, userId: string, role: UserRole, dto: UpdateApplicationStatusDto): Promise<Application> {
    const application = await this.findOrThrow(
      () => this.prisma.application.findUnique({ where: { id: applicationId }, include: { job: true } }),
      'Application'
    );

    if (role !== UserRole.ADMIN) {
      const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
      if (!employer || application.job.employerId !== employer.id) {
        throw new ForbiddenError('You cannot update this application');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const app = await tx.application.update({
        where: { id: applicationId },
        data: { status: dto.status, updatedById: userId },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          fromStatus: application.status,
          toStatus: dto.status,
          changedById: userId,
          reason: dto.reason,
        },
      });

      return app;
    });
  }

  async addEmployerNotes(applicationId: string, userId: string, role: UserRole, dto: AddEmployerNotesDto): Promise<Application> {
    const application = await this.findOrThrow(
      () => this.prisma.application.findUnique({ where: { id: applicationId }, include: { job: true } }),
      'Application'
    );

    if (role !== UserRole.ADMIN) {
      const employer = await this.prisma.employerProfile.findUnique({ where: { userId } });
      if (!employer || application.job.employerId !== employer.id) {
        throw new ForbiddenError('You cannot update this application');
      }
    }

    return this.prisma.application.update({
      where: { id: applicationId },
      data: { employerNotes: dto.notes, updatedById: userId },
    });
  }
}
