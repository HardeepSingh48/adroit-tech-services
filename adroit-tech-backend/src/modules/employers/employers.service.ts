import { BaseService } from '../../shared/base.service';
import { prisma } from '../../database/prisma';
import { NotFoundError } from '../../shared/errors';
import { UpdateEmployerProfileDto } from './employers.types';

export class EmployersService extends BaseService {
  constructor() {
    super(prisma);
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.employerProfile.findUnique({
      where: { userId },
      include: { user: { select: { email: true, phone: true, status: true } } },
    });
    if (!profile) throw new NotFoundError('Employer profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateEmployerProfileDto) {
    const profile = await this.getProfile(userId);
    return this.prisma.employerProfile.update({
      where: { id: profile.id },
      data: { ...dto, updatedById: userId },
    });
  }

  async getDashboardStats(userId: string) {
    const employer = await this.getProfile(userId);
    const [totalJobs, activeJobs, totalApplications, pendingApplications] = await Promise.all([
      this.prisma.job.count({ where: { employerId: employer.id, deletedAt: null } }),
      this.prisma.job.count({ where: { employerId: employer.id, status: 'ACTIVE', deletedAt: null } }),
      this.prisma.application.count({ where: { job: { employerId: employer.id } } }),
      this.prisma.application.count({ where: { job: { employerId: employer.id }, status: 'SUBMITTED' } }),
    ]);

    return { totalJobs, activeJobs, totalApplications, pendingApplications };
  }

  async listJobs(userId: string) {
    const employer = await this.getProfile(userId);
    return this.prisma.job.findMany({
      where: { employerId: employer.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getJobById(userId: string, jobId: string) {
    const employer = await this.getProfile(userId);
    const job = await this.prisma.job.findFirst({
      where: { id: jobId, employerId: employer.id, deletedAt: null },
      include: { applications: true },
    });
    if (!job) throw new NotFoundError('Job not found');
    return job;
  }

  async getJobApplications(userId: string, jobId: string) {
    await this.getJobById(userId, jobId);
    return this.prisma.application.findMany({
      where: { jobId },
      include: {
        jobSeeker: { include: { user: { select: { email: true, phone: true } } } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listAllApplications(userId: string) {
    const employer = await this.getProfile(userId);
    return this.prisma.application.findMany({
      where: { job: { employerId: employer.id } },
      include: {
        job: { select: { title: true, city: true } },
        jobSeeker: { include: { user: { select: { email: true, phone: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getApplicationById(userId: string, applicationId: string) {
    const employer = await this.getProfile(userId);
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, job: { employerId: employer.id } },
      include: {
        job: true,
        jobSeeker: { include: { user: { select: { email: true, phone: true } } } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!application) throw new NotFoundError('Application not found');
    return application;
  }

  async listNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
