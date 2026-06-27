export interface AppUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'DEACTIVATED';
  createdAt?: string;
  jobSeekerProfile?: { fullName?: string } | null;
  employerProfile?: { companyName?: string } | null;
}

export interface AppJobSeekerProfile {
  id: string;
  userId: string;
  fullName: string;
  experience?: string;
  skills?: string[];
  certifications?: string[];
  preferredCity?: string;
  resumeUrl?: string;
  createdAt?: string;
  user?: {
    email?: string;
    phone?: string;
  };
}

export interface AppJob {
  id: string;
  slug?: string;
  title: string;
  category?: string;
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  type: string;
  shift?: string;
  experienceLevel?: string;
  experience?: string;
  city?: string;
  location?: string;
  address?: string;
  salaryMin?: number;
  salaryMax?: number;
  salary?: string;
  positions?: number;
  isFeatured?: boolean;
  featured?: boolean;
  status?: string;
  applicationCount?: number;
  publishedAt?: string;
  createdAt?: string;
  postedDate?: string;
  employer?: {
    companyName?: string;
    logoUrl?: string;
    city?: string;
  };
}

export interface AppApplication {
  id: string;
  jobId: string;
  status: string;
  createdAt: string;
  coverLetter?: string;
  resumeUrl?: string;
  notes?: string;
  jobSeeker?: {
    fullName?: string;
    user?: {
      email?: string;
      phone?: string;
    };
  };
  job?: {
    title?: string;
    employer?: {
      companyName?: string;
    };
  };
  applicantName?: string;
  candidateName?: string;
  email?: string;
  candidateEmail?: string;
  phone?: string;
  candidatePhone?: string;
  appliedDate?: string;
}

export interface AppEmployerProfile {
  id: string;
  companyName: string;
  contactPerson: string;
  industry: string;
  companySize: string;
  address: string;
  city: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  gstNumber?: string;
  panNumber?: string;
  rejectionReason?: string;
  createdAt?: string;
  user?: {
    email?: string;
    phone?: string;
  };
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
}

