import { BaseService } from '../../shared/base.service';
import { prisma } from '../../database/prisma';
import { NotFoundError, ConflictError } from '../../shared/errors';
import { UpdateJobSeekerProfileDto } from './job-seekers.types';

export class JobSeekersService extends BaseService {
  constructor() {
    super(prisma);
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.jobSeekerProfile.findUnique({
      where: { userId },
      include: { user: { select: { email: true, phone: true, status: true } } },
    });
    if (!profile) throw new NotFoundError('Job seeker profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateJobSeekerProfileDto) {
    const profile = await this.prisma.jobSeekerProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError('Job seeker profile not found');

    const dob = dto.dateOfBirth ? new Date(dto.dateOfBirth) : profile.dateOfBirth;

    return this.prisma.jobSeekerProfile.update({
      where: { userId },
      data: {
        ...dto,
        dateOfBirth: dob,
        updatedById: userId,
      },
    });
  }

  async listApplications(userId: string) {
    const seeker = await this.getProfile(userId);
    return this.prisma.application.findMany({
      where: { jobSeekerId: seeker.id },
      include: {
        job: {
          include: {
            employer: { select: { companyName: true, logoUrl: true, city: true } },
          },
        },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getApplicationById(userId: string, applicationId: string) {
    const seeker = await this.getProfile(userId);
    const application = await this.prisma.application.findFirst({
      where: { id: applicationId, jobSeekerId: seeker.id },
      include: {
        job: { include: { employer: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!application) throw new NotFoundError('Application not found');
    return application;
  }

  async withdrawApplication(userId: string, applicationId: string) {
    const application = await this.getApplicationById(userId, applicationId);
    return this.prisma.application.update({
      where: { id: application.id },
      data: { status: 'WITHDRAWN', withdrawnAt: new Date(), updatedById: userId },
    });
  }

  async listSavedJobs(userId: string) {
    const seeker = await this.getProfile(userId);
    return this.prisma.savedJob.findMany({
      where: { jobSeekerId: seeker.id },
      include: {
        job: {
          include: { employer: { select: { companyName: true, logoUrl: true, city: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveJob(userId: string, jobId: string) {
    const seeker = await this.getProfile(userId);
    const existing = await this.prisma.savedJob.findUnique({
      where: { jobSeekerId_jobId: { jobSeekerId: seeker.id, jobId } },
    });
    if (existing) throw new ConflictError('Job already saved');
    return this.prisma.savedJob.create({
      data: { jobSeekerId: seeker.id, jobId },
    });
  }

  async unsaveJob(userId: string, jobId: string) {
    const seeker = await this.getProfile(userId);
    const existing = await this.prisma.savedJob.findUnique({
      where: { jobSeekerId_jobId: { jobSeekerId: seeker.id, jobId } },
    });
    if (!existing) throw new NotFoundError('Saved job not found');
    await this.prisma.savedJob.delete({ where: { id: existing.id } });
  }

  async listNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationRead(userId: string, id: string) {
    const notif = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!notif) throw new NotFoundError('Notification not found');
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllNotificationsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }
}
