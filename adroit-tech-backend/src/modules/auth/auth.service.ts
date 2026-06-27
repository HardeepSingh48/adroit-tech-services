import { UserRole, UserStatus, EmployerStatus, User, JobSeekerProfile, EmployerProfile } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { BaseService } from '../../shared/base.service';
import { prisma } from '../../database/prisma';
import { redis } from '../../config/redis.config';
import { hashPassword, comparePassword, hashToken, compareHash } from '../../utils/hash.util';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.util';
import { ConflictError, ForbiddenError, UnauthorizedError, NotFoundError, BadRequestError } from '../../shared/errors';
import { RegisterJobSeekerDto, RegisterEmployerDto, LoginDto, ChangePasswordDto } from './auth.types';
import { TokenPair, SafeUser } from '../../types/auth.types';

export type UserWithProfile = SafeUser & {
  profile?: JobSeekerProfile | EmployerProfile | null;
};

export class AuthService extends BaseService {
  constructor() {
    super(prisma);
  }

  private sanitizeUser(user: User): SafeUser {
    const { passwordHash: _hash, deletedAt: _deleted, ...safe } = user;
    return safe;
  }

  async registerJobSeeker(dto: RegisterJobSeekerDto): Promise<TokenPair & { user: SafeUser }> {
    if (!dto.email && !dto.phone) {
      throw new BadRequestError('Either email or phone must be provided');
    }

    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existingEmail) throw new ConflictError('Email already in use');
    }
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (existingPhone) throw new ConflictError('Phone number already in use');
    }

    const passwordHash = await hashPassword(dto.password);

    const { user } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          phone: dto.phone,
          passwordHash,
          role: UserRole.JOB_SEEKER,
          status: UserStatus.ACTIVE,
        },
      });

      await tx.jobSeekerProfile.create({
        data: {
          userId: user.id,
          fullName: dto.fullName,
          preferredCity: dto.preferredCity,
          experience: dto.experience || 'FRESHER',
          createdById: user.id,
        },
      });

      return { user };
    });

    const tokenPair = await this.createTokenPair(user.id, user.role);
    return { ...tokenPair, user: this.sanitizeUser(user) };
  }

  async registerEmployer(dto: RegisterEmployerDto): Promise<TokenPair & { user: SafeUser }> {
    const existingEmail = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingEmail) throw new ConflictError('Email already in use');

    const existingPhone = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existingPhone) throw new ConflictError('Phone number already in use');

    const passwordHash = await hashPassword(dto.password);

    const { user } = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          phone: dto.phone,
          passwordHash,
          role: UserRole.EMPLOYER,
          status: UserStatus.ACTIVE,
        },
      });

      await tx.employerProfile.create({
        data: {
          userId: user.id,
          companyName: dto.companyName,
          contactPerson: dto.contactPerson,
          industry: dto.industry,
          companySize: dto.companySize,
          address: dto.address,
          city: dto.city,
          gstNumber: dto.gstNumber,
          panNumber: dto.panNumber,
          status: EmployerStatus.PENDING_APPROVAL,
          createdById: user.id,
        },
      });

      return { user };
    });

    const tokenPair = await this.createTokenPair(user.id, user.role);
    return { ...tokenPair, user: this.sanitizeUser(user) };
  }

  async login(dto: LoginDto): Promise<TokenPair & { user: SafeUser }> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.identifier }, { phone: dto.identifier }],
        deletedAt: null,
      },
    });

    if (!user) throw new UnauthorizedError('Invalid credentials');
    if (user.status === UserStatus.SUSPENDED) throw new ForbiddenError('Your account has been suspended.');
    if (user.status === UserStatus.DEACTIVATED) throw new ForbiddenError('Your account has been deactivated.');

    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), loginCount: { increment: 1 } },
    });

    const tokenPair = await this.createTokenPair(user.id, user.role);
    return { ...tokenPair, user: this.sanitizeUser(user) };
  }

  async refreshTokens(rawRefreshToken: string): Promise<TokenPair> {
    const payload = verifyRefreshToken(rawRefreshToken);

    const tokenRecords = await this.prisma.refreshToken.findMany({
      where: {
        userId: payload.sub,
        sessionId: payload.sessionId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    let validRecord = null;
    for (const record of tokenRecords) {
      if (await compareHash(rawRefreshToken, record.token)) {
        validRecord = record;
        break;
      }
    }

    if (!validRecord) throw new UnauthorizedError('Invalid refresh token');

    await this.prisma.refreshToken.update({
      where: { id: validRecord.id },
      data: { revokedAt: new Date() },
    });

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedError('User not found');

    return this.createTokenPair(user.id, user.role);
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    try {
      if (redis.isOpen) {
        await redis.setEx(`revoked:session:${sessionId}`, 15 * 60, '1');
      }
    } catch {
      // ignore
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async getCurrentUser(userId: string): Promise<UserWithProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        jobSeekerProfile: true,
        employerProfile: true,
      },
    });
    if (!user) throw new NotFoundError('User not found');
    const safe = this.sanitizeUser(user);
    const profile = user.jobSeekerProfile || user.employerProfile || null;
    return { ...safe, profile };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');

    const isValid = await comparePassword(dto.currentPassword, user.passwordHash);
    if (!isValid) throw new BadRequestError('Current password is incorrect');

    const newHash = await hashPassword(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  }

  private async createTokenPair(userId: string, role: UserRole): Promise<TokenPair> {
    const sessionId = uuidv4();
    const accessToken = signAccessToken({ sub: userId, role, sessionId });
    const refreshToken = signRefreshToken({ sub: userId, sessionId });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        sessionId,
        token: await hashToken(refreshToken),
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}
