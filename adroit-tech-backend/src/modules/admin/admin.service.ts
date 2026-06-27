import { EmployerStatus, UserStatus } from '@prisma/client';
import { BaseService } from '../../shared/base.service';
import { prisma } from '../../database/prisma';
import { buildPaginatedResponse } from '../../shared/pagination.helper';
import { NotFoundError } from '../../shared/errors';

export class AdminService extends BaseService {
  constructor() {
    super(prisma);
  }

  async getPlatformStats() {
    const [totalUsers, totalEmployers, totalJobs, totalApplications] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.employerProfile.count(),
      this.prisma.job.count({ where: { deletedAt: null } }),
      this.prisma.application.count(),
    ]);

    return { totalUsers, totalEmployers, totalJobs, totalApplications };
  }

  async listUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          jobSeekerProfile: { select: { fullName: true } },
          employerProfile: { select: { companyName: true } },
        },
      }),
      this.prisma.user.count(),
    ]);
    return buildPaginatedResponse(users, total, page, limit);
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { jobSeekerProfile: true, employerProfile: true },
    });
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async updateUserStatus(id: string, status: UserStatus) {
    await this.getUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async listEmployers(status?: EmployerStatus) {
    return this.prisma.employerProfile.findMany({
      where: status ? { status } : undefined,
      include: { user: { select: { email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmployerById(id: string) {
    const employer = await this.prisma.employerProfile.findUnique({
      where: { id },
      include: { user: true, jobs: true },
    });
    if (!employer) throw new NotFoundError('Employer not found');
    return employer;
  }

  async approveEmployer(id: string, adminUserId: string) {
    await this.getEmployerById(id);
    return this.prisma.employerProfile.update({
      where: { id },
      data: {
        status: EmployerStatus.APPROVED,
        approvedAt: new Date(),
        approvedById: adminUserId,
      },
    });
  }

  async rejectEmployer(id: string, reason: string) {
    await this.getEmployerById(id);
    return this.prisma.employerProfile.update({
      where: { id },
      data: {
        status: EmployerStatus.REJECTED,
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });
  }

  async listJobs() {
    return this.prisma.job.findMany({
      include: { employer: { select: { companyName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async toggleJobFeatured(id: string) {
    const job = await this.findOrThrow(() => this.prisma.job.findUnique({ where: { id } }), 'Job');
    return this.prisma.job.update({
      where: { id },
      data: { isFeatured: !job.isFeatured },
    });
  }

  async hardDeleteJob(id: string) {
    await this.findOrThrow(() => this.prisma.job.findUnique({ where: { id } }), 'Job');
    await this.prisma.job.delete({ where: { id } });
  }

  async listApplications() {
    return this.prisma.application.findMany({
      include: {
        job: { select: { title: true } },
        jobSeeker: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listAuditLogs() {
    return this.prisma.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
    });
  }
}
