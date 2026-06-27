import { ExperienceLevel, UserRole } from '@prisma/client';

export interface RegisterJobSeekerDto {
  fullName: string;
  phone?: string;
  email?: string;
  password: string;
  preferredCity?: string;
  experience?: ExperienceLevel;
}

export interface RegisterEmployerDto {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  password: string;
  industry: string;
  companySize: string;
  address: string;
  city: string;
  gstNumber?: string;
  panNumber?: string;
}

export interface LoginDto {
  identifier: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
