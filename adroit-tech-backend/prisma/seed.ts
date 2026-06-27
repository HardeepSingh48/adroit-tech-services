import { PrismaClient, UserRole, UserStatus, EmployerStatus, ExperienceLevel, JobType, ShiftType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱 Starting database seed for testing...');

  const defaultPasswordHash = await bcrypt.hash('Test@123', SALT_ROUNDS);

  // 1. Seed Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@adroit.com' },
    update: {
      status: UserStatus.ACTIVE,
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'admin@adroit.com',
      phone: '9999999999',
      passwordHash: defaultPasswordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('✅ Admin User:', adminUser.email);

  // 2. Seed Approved Employer User
  const employerUser = await prisma.user.upsert({
    where: { email: 'employer@adroit.com' },
    update: {
      status: UserStatus.ACTIVE,
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'employer@adroit.com',
      phone: '8888888888',
      passwordHash: defaultPasswordHash,
      role: UserRole.EMPLOYER,
      status: UserStatus.ACTIVE,
    },
  });

  const employerProfile = await prisma.employerProfile.upsert({
    where: { userId: employerUser.id },
    update: {
      status: EmployerStatus.APPROVED,
    },
    create: {
      userId: employerUser.id,
      companyName: 'Apex Security Solutions Ltd',
      contactPerson: 'Rajesh Kumar',
      industry: 'Commercial',
      companySize: '50-100',
      address: '101 Business Park, Connaught Place',
      city: 'Delhi',
      state: 'Delhi NCR',
      status: EmployerStatus.APPROVED,
      gstNumber: '07AAAAA0000A1Z5',
      panNumber: 'ABCDE1234F',
    },
  });
  console.log('✅ Approved Employer User:', employerUser.email, `(${employerProfile.companyName})`);

  // 3. Seed Pending Employer User (for testing Approval flow)
  const pendingEmployerUser = await prisma.user.upsert({
    where: { email: 'pending.employer@adroit.com' },
    update: {
      status: UserStatus.ACTIVE,
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'pending.employer@adroit.com',
      phone: '7777777777',
      passwordHash: defaultPasswordHash,
      role: UserRole.EMPLOYER,
      status: UserStatus.ACTIVE,
    },
  });

  const pendingEmployerProfile = await prisma.employerProfile.upsert({
    where: { userId: pendingEmployerUser.id },
    update: {
      status: EmployerStatus.PENDING_APPROVAL,
    },
    create: {
      userId: pendingEmployerUser.id,
      companyName: 'Vanguard Shield Corp',
      contactPerson: 'Ankit Sharma',
      industry: 'Industrial Security',
      companySize: '11-50',
      address: 'Sector 62, Electronic City',
      city: 'Noida',
      state: 'Uttar Pradesh',
      status: EmployerStatus.PENDING_APPROVAL,
      gstNumber: '09BBBBB1111B2Z6',
      panNumber: 'XYZDE5678G',
    },
  });
  console.log('✅ Pending Employer User:', pendingEmployerUser.email, `(${pendingEmployerProfile.companyName})`);

  // 4. Seed Job Seeker User (Candidate)
  const jobSeekerUser = await prisma.user.upsert({
    where: { email: 'jobseeker@adroit.com' },
    update: {
      status: UserStatus.ACTIVE,
      passwordHash: defaultPasswordHash,
    },
    create: {
      email: 'jobseeker@adroit.com',
      phone: '6666666666',
      passwordHash: defaultPasswordHash,
      role: UserRole.JOB_SEEKER,
      status: UserStatus.ACTIVE,
    },
  });

  const jobSeekerProfile = await prisma.jobSeekerProfile.upsert({
    where: { userId: jobSeekerUser.id },
    update: {},
    create: {
      userId: jobSeekerUser.id,
      fullName: 'Vikram Singh',
      preferredCity: 'Delhi NCR',
      experience: ExperienceLevel.ONE_TO_THREE,
      bio: 'Experienced security guard with specialized training in access control and fire safety.',
    },
  });
  console.log('✅ Job Seeker Candidate:', jobSeekerUser.email, `(${jobSeekerProfile.fullName})`);

  // 5. Seed a Sample Job by Approved Employer
  const sampleJob = await prisma.job.upsert({
    where: { slug: 'senior-security-supervisor-connaught-place' },
    update: {},
    create: {
      employerId: employerProfile.id,
      title: 'Senior Security Supervisor',
      slug: 'senior-security-supervisor-connaught-place',
      category: 'Commercial Security',
      description: 'We are hiring an experienced Senior Security Supervisor to oversee day-to-day security operations at our Connaught Place commercial complex.',
      responsibilities: ['Oversee guard deployments and shift rosters', 'Conduct regular perimeter patrols', 'Manage visitor logs and CCTV monitoring'],
      requirements: ['Minimum 2 years security experience', 'Clean criminal background check', 'Good communication skills in Hindi & English'],
      benefits: ['ESI & PF Coverage', 'Free Uniform Provided', 'Annual Performance Bonus'],
      type: JobType.FULL_TIME,
      shift: ShiftType.DAY,
      experienceLevel: ExperienceLevel.ONE_TO_THREE,
      city: 'Delhi',
      address: 'Connaught Place, New Delhi',
      salaryMin: 18000,
      salaryMax: 25000,
      positions: 3,
      isFeatured: true,
      status: 'ACTIVE',
      createdById: employerUser.id,
    },
  });
  console.log('✅ Sample Active Job Posted:', sampleJob.title);

  console.log('\n✨ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
