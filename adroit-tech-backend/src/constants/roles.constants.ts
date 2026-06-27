import { UserRole } from '@prisma/client';

export const USER_ROLES = {
  JOB_SEEKER: UserRole.JOB_SEEKER,
  EMPLOYER: UserRole.EMPLOYER,
  ADMIN: UserRole.ADMIN,
} as const;
