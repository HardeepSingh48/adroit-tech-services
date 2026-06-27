import { z } from 'zod';
import { ExperienceLevel } from '@prisma/client';

export const registerJobSeekerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  preferredCity: z.string().optional(),
  experience: z.nativeEnum(ExperienceLevel).optional(),
});

export const registerEmployerSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  industry: z.string().min(2, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});
