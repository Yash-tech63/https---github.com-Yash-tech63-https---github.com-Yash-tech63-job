const bcrypt = require('bcryptjs');
const User = require('../models/User');
const CandidateProfile = require('../models/CandidateProfile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Plan = require('../models/Plan.model');
const Subscription = require('../models/Subscription.model');

const seedDatabase = async () => {
  try {
    console.log('[Database Seed] Initializing database seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      CandidateProfile.deleteMany({}),
      Company.deleteMany({}),
      Job.deleteMany({}),
      Application.deleteMany({})
    ]);

    const salt = await bcrypt.genSalt(10);
    const adminPassHash = await bcrypt.hash('admin@123', salt);
    const recruiterPassHash = await bcrypt.hash('recruiter@123', salt);
    const candidatePassHash = await bcrypt.hash('candidate@123', salt);

    // 1. Seed Admin User
    const adminUser = await User.create({
      email: 'admin@truehire.io',
      passwordHash: adminPassHash,
      role: 'admin'
    });
    console.log('✅ Admin user created: admin@truehire.io / admin@123');

    // 2. Seed Verified Recruiter & Company (Linear Labs)
    const recruiterUser1 = await User.create({
      email: 'recruiter@linear.app',
      passwordHash: recruiterPassHash,
      role: 'recruiter'
    });

    const companyVerified = await Company.create({
      ownerUserId: recruiterUser1._id,
      name: 'Linear Labs',
      website: 'https://linear.app',
      industry: 'Developer Tools & SaaS',
      size: '50-100 employees',
      location: 'San Francisco, CA (Remote Friendly)',
      description: 'Linear is a purpose-built tool for modern software development. Streamline issues, projects, and product roadmaps with high craft.',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
      verificationStatus: 'valid',
      adminNote: 'Verified enterprise entity. Delaware C-Corp verified via domain and official corporate records.',
      reviewedBy: adminUser._id,
      reviewedAt: new Date(Date.now() - 86400000 * 5)
    });

    // 3. Seed Additional Verified Company (Vercel Ecosystem)
    const recruiterUser2 = await User.create({
      email: 'talent@vercel.com',
      passwordHash: recruiterPassHash,
      role: 'recruiter'
    });

    const companyVerified2 = await Company.create({
      ownerUserId: recruiterUser2._id,
      name: 'Vercel Cloud',
      website: 'https://vercel.com',
      industry: 'Cloud Infrastructure & Web Platforms',
      size: '200-500 employees',
      location: 'Remote / Global',
      description: 'Vercel is the platform for frontend developers, providing the speed and reliability needed to build at the speed of thought.',
      logoUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=120&h=120&q=80',
      verificationStatus: 'valid',
      adminNote: 'Official corporate recruitment account authenticated and verified.',
      reviewedBy: adminUser._id,
      reviewedAt: new Date(Date.now() - 86400000 * 2)
    });

    // 4. Seed Pending Recruiter & Company (Arc Interactive)
    const recruiterUser3 = await User.create({
      email: 'founder@thebrowser.company',
      passwordHash: recruiterPassHash,
      role: 'recruiter'
    });

    const companyPending = await Company.create({
      ownerUserId: recruiterUser3._id,
      name: 'Arc Interactive',
      website: 'https://thebrowser.company',
      industry: 'Consumer Software & Web Browsers',
      size: '20-50 employees',
      location: 'New York, NY',
      description: 'Building Arc, a browser designed to push the internet forward with fresh UX, spaces, and fluid interactions.',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80',
      verificationStatus: 'pending',
      adminNote: ''
    });

    // 5. Seed Invalid / Rejected Recruiter & Company
    const recruiterUser4 = await User.create({
      email: 'contact@cryptomoon.fake',
      passwordHash: recruiterPassHash,
      role: 'recruiter'
    });

    const companyInvalid = await Company.create({
      ownerUserId: recruiterUser4._id,
      name: 'CryptoMoon Rapid Growth',
      website: 'http://cryptomoon-get-rich-fast.xyz',
      industry: 'Web3 & Financial Services',
      size: '1-10 employees',
      location: 'Unknown',
      description: 'High yield financial staking and offshore telegram arbitrage.',
      verificationStatus: 'invalid',
      adminNote: 'Failed identity verification check. Unregistered legal entity with anonymous leadership and suspicious escrow terms.',
      reviewedBy: adminUser._id,
      reviewedAt: new Date(Date.now() - 86400000 * 1)
    });

    // 6. Seed Jobs for Verified Companies (These WILL appear on public job board)
    const job1 = await Job.create({
      companyId: companyVerified._id,
      createdBy: recruiterUser1._id,
      title: 'Frontend Intern',
      type: 'internship',
      description: 'We are seeking an obsessive, craft-focused Frontend Intern to join our web team. You will work directly on high-performance interactive interfaces using React, TypeScript, and Tailwind CSS. You will collaborate closely with world-class engineers and designers to build lightning-fast web experiences.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Web Performance'],
      salary: '$3,800 / month',
      duration: '3 Months (Summer 2025)',
      workMode: 'remote',
      location: 'Remote (Worldwide)',
      deadline: new Date(Date.now() + 86400000 * 30),
      status: 'published'
    });

    const job2 = await Job.create({
      companyId: companyVerified._id,
      createdBy: recruiterUser1._id,
      title: 'Software Engineer - Platform',
      type: 'job',
      description: 'Join Linear as a Full Stack Platform Engineer. You will architect resilient backend microservices, real-time sync engines, and GraphQL APIs handling millions of events daily.',
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
      salary: '$140,000 - $175,000 / year',
      duration: 'Full-time',
      workMode: 'remote',
      location: 'San Francisco, CA or Remote',
      deadline: new Date(Date.now() + 86400000 * 45),
      status: 'published'
    });

    const job3 = await Job.create({
      companyId: companyVerified2._id,
      createdBy: recruiterUser2._id,
      title: 'AI Engineer - Edge Intelligence',
      type: 'job',
      description: 'Work at the frontier of Generative AI infrastructure. Build low-latency inference pipelines, agentic streaming protocols, and Next.js AI integrations.',
      skills: ['Python', 'PyTorch', 'Next.js', 'LangChain', 'TypeScript'],
      salary: '$150,000 - $190,000 / year',
      duration: 'Full-time',
      workMode: 'remote',
      location: 'Remote (US/EU)',
      deadline: new Date(Date.now() + 86400000 * 20),
      status: 'published'
    });

    const job4 = await Job.create({
      companyId: companyVerified2._id,
      createdBy: recruiterUser2._id,
      title: 'Product Design Intern',
      type: 'internship',
      description: 'Shape the next generation of developer experiences. Focus on modern typography, micro-interactions, dark mode aesthetics, and human-computer interfaces.',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'CSS'],
      salary: '$4,200 / month',
      duration: '6 Months',
      workMode: 'hybrid',
      location: 'San Francisco, CA',
      deadline: new Date(Date.now() + 86400000 * 25),
      status: 'published'
    });

    // 7. Seed Jobs for PENDING Company (These will NOT show on public board until verified!)
    const jobPending1 = await Job.create({
      companyId: companyPending._id,
      createdBy: recruiterUser3._id,
      title: 'Chromium Core Intern',
      type: 'internship',
      description: 'Deep dive into browser rendering pipelines and memory isolation.',
      skills: ['C++', 'Rust', 'Chromium'],
      salary: '$5,000 / month',
      duration: '3 Months',
      workMode: 'onsite',
      location: 'New York, NY',
      status: 'published'
    });

    // 8. Seed Jobs for INVALID Company (Strictly hidden!)
    await Job.create({
      companyId: companyInvalid._id,
      createdBy: recruiterUser4._id,
      title: 'Telegram Crypto Chat Moderator',
      type: 'internship',
      description: 'Unverified spam job.',
      skills: ['Telegram', 'Crypto'],
      salary: '$1,000 / week',
      duration: '1 Month',
      workMode: 'remote',
      location: 'Remote',
      status: 'published'
    });

    // 9. Seed Candidate User & Profile
    const candidateUser = await User.create({
      email: 'alex.dev@stanford.edu',
      passwordHash: candidatePassHash,
      role: 'candidate'
    });

    const candidateProfile = await CandidateProfile.create({
      userId: candidateUser._id,
      name: 'Alex Chen',
      headline: 'Computer Science Senior @ Stanford | Full-Stack & Systems Engineer',
      education: [
        {
          college: 'Stanford University',
          degree: 'B.S. in Computer Science',
          gradYear: '2025'
        }
      ],
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'MongoDB', 'Python', 'Framer Motion'],
      experience: [
        {
          title: 'Software Engineering Intern',
          company: 'HyperScale Cloud',
          duration: 'June 2024 - Aug 2024',
          description: 'Engineered real-time telemetry dashboards in React and Node.js serving 12,000+ active enterprise developers.'
        },
        {
          title: 'Open Source Contributor',
          company: 'Modern Web Tools',
          duration: 'Jan 2024 - Present',
          description: 'Created popular UI library components with 1,500+ GitHub stars.'
        }
      ],
      preferences: {
        preferredRole: 'Frontend Intern or Full-Stack Engineer',
        location: 'Remote or San Francisco, CA'
      },
      links: {
        linkedin: 'https://linkedin.com/in/alexchen-dev',
        github: 'https://github.com/alexchen',
        portfolio: 'https://alexchen.codes'
      },
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      resumeOriginalName: 'Alex_Chen_Resume_2025.pdf',
      profileComplete: true
    });

    // 10. Seed Application
    await Application.create({
      jobId: job1._id,
      candidateId: candidateUser._id,
      companyId: companyVerified._id,
      status: 'shortlisted',
      notes: 'Strong portfolio and solid background in React & Tailwind.'
    });

    // 11. Seed Recruiter Plans
    await Plan.deleteMany({});
    const starterPlan = await Plan.create({
      name: 'Starter',
      slug: 'starter',
      description: 'Ideal for early startups and individual hiring managers testing out hiring.',
      price: 499,
      currency: 'INR',
      billingType: 'per_job',
      durationDays: 30,
      jobPostingLimit: 1,
      featuredListing: false,
      analyticsEnabled: false,
      multipleRecruiters: false,
      features: [
        '1 Job Posting',
        '30 Days Listing',
        'Applicant Management',
        'Basic Application Tracking'
      ],
      isActive: true
    });

    const proPlan = await Plan.create({
      name: 'Professional',
      slug: 'professional',
      description: 'Perfect for growing companies hiring developers, designers, and growth talent.',
      price: 1499,
      currency: 'INR',
      billingType: 'monthly',
      durationDays: 30,
      jobPostingLimit: 5,
      featuredListing: true,
      analyticsEnabled: true,
      multipleRecruiters: false,
      features: [
        '5 Active Job Listings',
        'Featured Job Listing',
        'Applicant Tracking',
        'Recruiter Dashboard Analytics',
        '30 Days Subscription'
      ],
      isActive: true
    });

    const enterprisePlan = await Plan.create({
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'For scale-ups and enterprises with aggressive talent acquisition pipelines.',
      price: 3999,
      currency: 'INR',
      billingType: 'monthly',
      durationDays: 30,
      jobPostingLimit: 20,
      featuredListing: true,
      analyticsEnabled: true,
      multipleRecruiters: true,
      features: [
        '20 Active Job Listings',
        'Priority Job Visibility',
        'Advanced Hiring Analytics',
        'Multiple Recruiter Accounts',
        '30 Days Subscription'
      ],
      isActive: true
    });

    // Seed active subscription for Linear demo recruiter
    await Subscription.deleteMany({});
    await Subscription.create({
      recruiterId: recruiterUser1._id,
      companyId: companyVerified._id,
      planId: proPlan._id,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      jobPostingLimit: 5,
      usedJobPostings: 2,
      activeJobCount: 2,
      features: {
        featuredListing: true,
        analyticsEnabled: true,
        multipleRecruiters: false
      }
    });

    console.log('[Database Seed] Seeding completed successfully!');
    console.log('--------------------------------------------------');
    console.log('DEMO ACCOUNTS READY:');
    console.log('👑 Admin:     admin@truehire.io / admin@123');
    console.log('🏢 Recruiter: recruiter@linear.app / recruiter@123 (Verified Company)');
    console.log('⏳ Recruiter: founder@thebrowser.company / recruiter@123 (Pending Company)');
    console.log('🎓 Candidate: alex.dev@stanford.edu / candidate@123');
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error('[Database Seed] Seeding error:', err);
  }
};

module.exports = { seedDatabase };
