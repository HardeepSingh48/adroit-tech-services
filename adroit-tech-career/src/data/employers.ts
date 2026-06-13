export interface Employer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  companySize: string;
  logo?: string;
  gstNumber?: string;
  panNumber?: string;
  website?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidatePhoto?: string;
  resumeUrl?: string;
  appliedDate: string;
  status: 'new' | 'shortlisted' | 'rejected' | 'interviewed' | 'hired';
  experience: string;
  availability: string;
  notes?: string;
}

export const industryTypes = [
  "Residential",
  "Commercial",
  "Industrial",
  "Event Management",
  "Corporate",
  "Other"
];

export const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+"
];

// Mock employer data
export const mockEmployer: Employer = {
  id: "emp-001",
  companyName: "ABC Securities Pvt. Ltd.",
  contactPerson: "Rajesh Kumar",
  email: "rajesh@abcsecurities.com",
  phone: "+91 9876543210",
  address: "Plot 42, Sector 18, Gurgaon",
  industry: "Commercial",
  companySize: "51-200",
  createdAt: "2024-01-15"
};

// Mock applications data
export const mockApplications: Application[] = [
  {
    id: "app-001",
    jobId: "1",
    candidateId: "cand-001",
    candidateName: "Ramesh Singh",
    candidateEmail: "ramesh.singh@email.com",
    candidatePhone: "+91 9876543201",
    appliedDate: "2024-12-10",
    status: "new",
    experience: "1-3 years",
    availability: "Immediate"
  },
  {
    id: "app-002",
    jobId: "1",
    candidateId: "cand-002",
    candidateName: "Suresh Yadav",
    candidateEmail: "suresh.yadav@email.com",
    candidatePhone: "+91 9876543202",
    appliedDate: "2024-12-09",
    status: "shortlisted",
    experience: "3+ years",
    availability: "2 weeks"
  },
  {
    id: "app-003",
    jobId: "2",
    candidateId: "cand-003",
    candidateName: "Vikram Sharma",
    candidateEmail: "vikram.sharma@email.com",
    candidatePhone: "+91 9876543203",
    appliedDate: "2024-12-08",
    status: "interviewed",
    experience: "Fresher",
    availability: "Immediate"
  },
  {
    id: "app-004",
    jobId: "3",
    candidateId: "cand-004",
    candidateName: "Anil Kumar",
    candidateEmail: "anil.kumar@email.com",
    candidatePhone: "+91 9876543204",
    appliedDate: "2024-12-07",
    status: "hired",
    experience: "1-3 years",
    availability: "1 week"
  },
  {
    id: "app-005",
    jobId: "1",
    candidateId: "cand-005",
    candidateName: "Deepak Verma",
    candidateEmail: "deepak.verma@email.com",
    candidatePhone: "+91 9876543205",
    appliedDate: "2024-12-06",
    status: "rejected",
    experience: "0-1 years",
    availability: "Immediate"
  }
];
