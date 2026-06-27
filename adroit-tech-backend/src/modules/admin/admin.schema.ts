import { z } from 'zod';
import { UserStatus } from '@prisma/client';

export const updateUserStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});

export const rejectEmployerSchema = z.object({
  reason: z.string().min(2, 'Rejection reason is required'),
});
