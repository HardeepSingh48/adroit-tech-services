import { z } from 'zod';
import { ExperienceLevel, JobStatus, JobType, ShiftType } from '@prisma/client';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  type: z.nativeEnum(JobType),
  shift: z.nativeEnum(ShiftType),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Address is required'),
  salaryMin: z.number().min(0, 'Min salary must be non-negative'),
  salaryMax: z.number().min(0, 'Max salary must be non-negative'),
  positions: z.number().int().positive().default(1),
  ageMin: z.number().int().optional(),
  ageMax: z.number().int().optional(),
  education: z.string().optional(),
  deadline: z.string().optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const updateJobStatusSchema = z.object({
  status: z.nativeEnum(JobStatus),
});

export const jobQuerySchema = z.object({
  city: z.string().optional(),
  category: z.string().optional(),
  type: z.nativeEnum(JobType).optional(),
  shift: z.nativeEnum(ShiftType).optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
  salaryMin: z.string().transform(Number).optional(),
  salaryMax: z.string().transform(Number).optional(),
  isFeatured: z.string().transform((val) => val === 'true').optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
