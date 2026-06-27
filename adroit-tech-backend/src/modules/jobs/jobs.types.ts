import { ExperienceLevel, JobStatus, JobType, ShiftType } from '@prisma/client';

export interface CreateJobDto {
  title: string;
  category: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  type: JobType;
  shift: ShiftType;
  experienceLevel: ExperienceLevel;
  city: string;
  address: string;
  salaryMin: number;
  salaryMax: number;
  positions?: number;
  ageMin?: number;
  ageMax?: number;
  education?: string;
  deadline?: string;
}

export type UpdateJobDto = Partial<CreateJobDto>;

export interface JobFiltersDto {
  city?: string;
  category?: string;
  type?: JobType;
  shift?: ShiftType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  isFeatured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
