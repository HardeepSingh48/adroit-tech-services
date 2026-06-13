export interface Job {
  id: string;
  title: string;
  location: string;
  city: string;
  salary: string;
  salaryMin: number;
  salaryMax: number;
  type: "Full-time" | "Part-time" | "Contract";
  shift: "Day" | "Night" | "Rotational";
  experience: string;
  experienceYears: number;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  featured: boolean;
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Security Guard",
    location: "Connaught Place, Delhi",
    city: "Delhi",
    salary: "₹15,000 - ₹20,000/month",
    salaryMin: 15000,
    salaryMax: 20000,
    type: "Full-time",
    shift: "Rotational",
    experience: "Fresher",
    experienceYears: 0,
    postedDate: "2024-01-05",
    description: "We are looking for a vigilant and professional Security Guard to join our team at a prestigious corporate office in Connaught Place. The ideal candidate will ensure the safety and security of premises, employees, and visitors.",
    responsibilities: [
      "Monitor and patrol premises regularly",
      "Control access points and verify visitor credentials",
      "Respond to alarms and emergency situations",
      "Maintain daily security logs and incident reports",
      "Coordinate with local authorities when necessary"
    ],
    requirements: [
      "Age between 21-45 years",
      "Minimum 10th pass education",
      "Good physical fitness",
      "Basic Hindi and English communication",
      "No criminal background"
    ],
    benefits: [
      "ESI & PF coverage",
      "Free uniform provided",
      "Weekly off",
      "Overtime pay",
      "Festival bonus"
    ],
    featured: true
  },
  {
    id: "2",
    title: "Night Watchman",
    location: "Gurgaon Sector 29",
    city: "Gurgaon",
    salary: "₹14,000 - ₹18,000/month",
    salaryMin: 14000,
    salaryMax: 18000,
    type: "Full-time",
    shift: "Night",
    experience: "0-1 years",
    experienceYears: 1,
    postedDate: "2024-01-04",
    description: "Night Watchman required for a residential society in Gurgaon. Must be alert and responsible for overnight security duties.",
    responsibilities: [
      "Patrol residential complex during night hours",
      "Monitor CCTV cameras",
      "Manage visitor entry during night",
      "Report any suspicious activities",
      "Ensure all entry/exit points are secure"
    ],
    requirements: [
      "Age between 25-50 years",
      "Minimum 8th pass",
      "Ability to stay alert during night shifts",
      "Previous watchman experience preferred",
      "Local resident preferred"
    ],
    benefits: [
      "ESI & PF",
      "Night shift allowance",
      "Free meals during shift",
      "Accommodation available",
      "Yearly bonus"
    ],
    featured: true
  },
  {
    id: "3",
    title: "Bouncer",
    location: "Hauz Khas, Delhi",
    city: "Delhi",
    salary: "₹22,000 - ₹30,000/month",
    salaryMin: 22000,
    salaryMax: 30000,
    type: "Full-time",
    shift: "Night",
    experience: "1-3 years",
    experienceYears: 2,
    postedDate: "2024-01-03",
    description: "Experienced Bouncer needed for a popular nightclub in Hauz Khas. Must have strong physique and crowd management skills.",
    responsibilities: [
      "Manage entry and crowd control",
      "Check IDs and verify age",
      "Handle unruly patrons professionally",
      "Ensure safety of guests and staff",
      "Coordinate with event management"
    ],
    requirements: [
      "Age between 25-40 years",
      "Height minimum 5'10\"",
      "Strong physical build",
      "Experience in crowd management",
      "Self-defense training preferred"
    ],
    benefits: [
      "High salary",
      "Tips and incentives",
      "Free meals",
      "Health insurance",
      "Growth opportunities"
    ],
    featured: true
  },
  {
    id: "4",
    title: "Lady Security Guard",
    location: "Noida Sector 18",
    city: "Noida",
    salary: "₹16,000 - ₹22,000/month",
    salaryMin: 16000,
    salaryMax: 22000,
    type: "Full-time",
    shift: "Day",
    experience: "Fresher",
    experienceYears: 0,
    postedDate: "2024-01-02",
    description: "Female security personnel required for a shopping mall in Noida. Will be responsible for frisking and security checks for female visitors.",
    responsibilities: [
      "Conduct security checks for female visitors",
      "Assist with emergency evacuations",
      "Monitor ladies' restroom areas",
      "Report suspicious activities",
      "Assist mall management as needed"
    ],
    requirements: [
      "Female candidates only",
      "Age between 21-40 years",
      "Minimum 10th pass",
      "Good communication skills",
      "Professional appearance"
    ],
    benefits: [
      "ESI & PF",
      "Uniform provided",
      "Ladies' hostel facility",
      "Transport allowance",
      "Creche facility"
    ],
    featured: true
  },
  {
    id: "5",
    title: "CCTV Operator",
    location: "Vasant Kunj, Delhi",
    city: "Delhi",
    salary: "₹18,000 - ₹25,000/month",
    salaryMin: 18000,
    salaryMax: 25000,
    type: "Full-time",
    shift: "Rotational",
    experience: "0-1 years",
    experienceYears: 1,
    postedDate: "2024-01-01",
    description: "CCTV Operator needed for a large commercial complex. Must be computer literate and have good observation skills.",
    responsibilities: [
      "Monitor multiple CCTV screens",
      "Record and report incidents",
      "Maintain CCTV equipment",
      "Coordinate with ground security team",
      "Generate daily surveillance reports"
    ],
    requirements: [
      "Age between 21-45 years",
      "12th pass minimum",
      "Basic computer knowledge",
      "Good eyesight",
      "Attention to detail"
    ],
    benefits: [
      "AC control room",
      "ESI & PF",
      "Skill development training",
      "Performance bonus",
      "Medical insurance"
    ],
    featured: true
  },
  {
    id: "6",
    title: "Gate Keeper",
    location: "Faridabad",
    city: "Faridabad",
    salary: "₹12,000 - ₹15,000/month",
    salaryMin: 12000,
    salaryMax: 15000,
    type: "Full-time",
    shift: "Day",
    experience: "Fresher",
    experienceYears: 0,
    postedDate: "2023-12-30",
    description: "Gate Keeper required for a factory in Faridabad industrial area. Simple duties with regular hours.",
    responsibilities: [
      "Manage main gate operations",
      "Record vehicle entry/exit",
      "Verify employee ID cards",
      "Receive and direct visitors",
      "Maintain gate area cleanliness"
    ],
    requirements: [
      "Age between 20-55 years",
      "Minimum 5th pass",
      "Basic reading and writing",
      "Polite demeanor",
      "Local candidates preferred"
    ],
    benefits: [
      "Fixed day shift",
      "Weekly off",
      "PF available",
      "Bonus on festivals",
      "Regular salary"
    ],
    featured: false
  },
  {
    id: "7",
    title: "Event Security",
    location: "Various Locations, Delhi NCR",
    city: "Delhi",
    salary: "₹800 - ₹1,200/day",
    salaryMin: 24000,
    salaryMax: 36000,
    type: "Part-time",
    shift: "Rotational",
    experience: "0-1 years",
    experienceYears: 0,
    postedDate: "2023-12-28",
    description: "Event security personnel needed for concerts, weddings, and corporate events. Flexible schedule with high daily wages.",
    responsibilities: [
      "Crowd management at events",
      "VIP protection duties",
      "Perimeter security",
      "Emergency response",
      "Coordinate with event organizers"
    ],
    requirements: [
      "Age between 21-45 years",
      "Good physical fitness",
      "Flexible availability",
      "Team player",
      "Smart appearance"
    ],
    benefits: [
      "High daily wages",
      "Food provided at events",
      "Transport allowance",
      "Tips from clients",
      "Regular work opportunities"
    ],
    featured: true
  },
  {
    id: "8",
    title: "Security Supervisor",
    location: "Dwarka, Delhi",
    city: "Delhi",
    salary: "₹25,000 - ₹35,000/month",
    salaryMin: 25000,
    salaryMax: 35000,
    type: "Full-time",
    shift: "Rotational",
    experience: "1-3 years",
    experienceYears: 3,
    postedDate: "2023-12-25",
    description: "Experienced Security Supervisor to lead a team of guards at a residential township. Leadership and management skills required.",
    responsibilities: [
      "Supervise team of 10-15 guards",
      "Prepare duty rosters",
      "Handle client complaints",
      "Train new security staff",
      "Liaise with management"
    ],
    requirements: [
      "Age between 28-50 years",
      "12th pass minimum",
      "3+ years security experience",
      "Leadership qualities",
      "Good communication skills"
    ],
    benefits: [
      "Supervisor allowance",
      "ESI & PF",
      "Mobile phone provided",
      "Quarterly bonus",
      "Career advancement"
    ],
    featured: true
  }
];

export const cities = ["Delhi", "Gurgaon", "Noida", "Faridabad", "Ghaziabad"];
export const jobTypes = ["Full-time", "Part-time", "Contract"];
export const shifts = ["Day", "Night", "Rotational"];
export const experienceLevels = ["Fresher", "0-1 years", "1-3 years", "3+ years"];
export const jobCategories = [
  "Security Guard",
  "Watchman",
  "Bouncer",
  "CCTV Operator",
  "Security Supervisor",
  "Gate Keeper",
  "Event Security",
  "Armed Guard",
  "Lady Security Guard",
  "Patrol Officer"
];

export const stats = {
  activeJobs: 150,
  totalApplications: 8500,
  candidatesHired: 3200,
  companiesServed: 45
};
