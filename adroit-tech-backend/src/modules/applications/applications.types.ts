import { ApplicationStatus } from '@prisma/client';

export interface ApplyForJobDto {
  availability: string;
  coverNote?: string;
  experienceNote?: string;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
  reason?: string;
}

export interface AddEmployerNotesDto {
  notes: string;
}
