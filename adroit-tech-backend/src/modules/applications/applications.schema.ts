import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';

export const applyForJobSchema = z.object({
  availability: z.string().min(1, 'Availability is required'),
  coverNote: z.string().optional(),
  experienceNote: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
  reason: z.string().optional(),
});

export const addEmployerNotesSchema = z.object({
  notes: z.string().min(1, 'Notes are required'),
});
