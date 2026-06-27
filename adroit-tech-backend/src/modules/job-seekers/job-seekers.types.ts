import { ExperienceLevel } from '@prisma/client';

export interface UpdateJobSeekerProfileDto {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredCity?: string;
  currentAddress?: string;
  experience?: ExperienceLevel;
  bio?: string;
  photoUrl?: string;
  resumeUrl?: string;
}
