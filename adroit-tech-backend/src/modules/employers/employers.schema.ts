import { z } from 'zod';

export const updateEmployerProfileSchema = z.object({
  companyName: z.string().min(2).optional(),
  contactPerson: z.string().min(2).optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  logoUrl: z.string().url().optional(),
  panCardUrl: z.string().url().optional(),
});
