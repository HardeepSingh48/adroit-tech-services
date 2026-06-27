import { EmployerStatus, UserStatus } from '@prisma/client';

export interface UpdateUserStatusDto {
  status: UserStatus;
}

export interface RejectEmployerDto {
  reason: string;
}
