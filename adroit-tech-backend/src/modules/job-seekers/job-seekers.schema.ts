import { z } from 'zod';
import { ExperienceLevel } from '@prisma/client';

export const updateJobSeekerProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  preferredCity: z.string().optional(),
  currentAddress: z.string().optional(),
  experience: z.nativeEnum(ExperienceLevel).optional(),
  bio: z.string().optional(),
  photoUrl: z.string().url().optional(),
  resumeUrl: z.string().url().optional(),
});
