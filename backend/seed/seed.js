require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Job = require('../models/Job');
const Product = require('../models/Product');
const Candidate = require('../models/Candidate');
const Application = require('../models/Application');
const Blog = require('../models/Blog');
const Event = require('../models/Event');

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildProducts() {
  return [
    {
      title: 'React Mastery Course',
      category: 'Courses',
      price: 99,
      shortDescription: 'Production-focused React + architecture course for modern SaaS apps.',
      description: 'Deep React patterns, performance tuning, testing, and reusable component architecture for enterprise products.',
      image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1200&q=80',
      features: ['Hooks Deep Dive', 'State Architecture', 'Testing Library'],
    },
    {
      title: 'Node API Engineering',
      category: 'Courses',
      price: 109,
      shortDescription: 'Build secure and scalable Node.js APIs with MongoDB.',
      description: 'Learn REST design, auth, security middleware, indexing, and API observability for production deployments.',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
      features: ['JWT Auth', 'Mongoose Patterns', 'API Hardening'],
    },
    {
      title: 'DSA Bootcamp',
      category: 'Courses',
      price: 89,
      shortDescription: 'Interview-targeted data structures and algorithms roadmap.',
      description: 'Master common interview patterns with live practice sets, complexity analysis, and coding contest drills.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      features: ['Pattern Sheets', 'Mock Contests', 'Complexity Clinics'],
    },
    {
      title: 'System Design Accelerator',
      category: 'Courses',
      price: 129,
      shortDescription: 'Design distributed systems with practical case studies.',
      description: 'Covers architecture tradeoffs, scalability, consistency, caching, queues, and observability patterns.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      features: ['Case Studies', 'Architecture Templates', 'Interview Drills'],
    },
    {
      title: 'AI Resume Analyzer',
      category: 'Tools',
      price: 39,
      shortDescription: 'Score resume quality with ATS and recruiter lens.',
      description: 'Instantly detect keyword gaps, role mismatch, and readability issues with actionable recommendations.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      features: ['ATS Score', 'Keyword Gaps', 'Rewrite Suggestions'],
    },
    {
      title: 'Mock Interview Simulator',
      category: 'Tools',
      price: 59,
      shortDescription: 'Run realistic interviews with AI-backed feedback loops.',
      description: 'Practice behavioral and technical rounds, record responses, and track confidence progression.',
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80',
      features: ['Behavioral Questions', 'Tech Rounds', 'Feedback Reports'],
    },
    {
      title: 'Portfolio Builder',
      category: 'Tools',
      price: 29,
      shortDescription: 'Create recruiter-ready portfolios in minutes.',
      description: 'Portfolio templates, SEO optimization, and role-specific project storytelling blocks.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      features: ['Templates', 'SEO Blocks', 'Project Highlights'],
    },
    {
      title: 'Salary Insights Tool',
      category: 'Tools',
      price: 35,
      shortDescription: 'Benchmark salary by role, region, and experience.',
      description: 'Get compensation insights and negotiation tips using real market trend datasets.',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
      features: ['Market Bands', 'Negotiation Hints', 'Regional Trends'],
    },
    {
      title: 'Interview Prep Kit',
      category: 'Services',
      price: 149,
      shortDescription: '1:1 mock interviews and personalized prep plans.',
      description: 'Work with senior mentors to prepare for coding, product, and system design interviews.',
      image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80',
      features: ['Mentor Sessions', 'Personalized Plan', 'Evaluation Reports'],
    },
    {
      title: 'Freelance Marketplace Pro',
      category: 'Services',
      price: 79,
      shortDescription: 'Find vetted freelance gigs matched to your profile.',
      description: 'Smart gig matching, portfolio visibility boosts, and client communication templates.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      features: ['Gig Matching', 'Visibility Boost', 'Client Templates'],
    },
  ].map((product, index) => ({
    ...product,
    sku: `SKU-${String(index + 1).padStart(3, '0')}`,
    slug: slugify(product.title),
    name: product.title,
    rating: 0,
    reviewsCount: 0,
    reviews: [],
    qna: [],
  }));
}

function buildJobs() {
  const titles = [
    'Frontend Engineer',
    'Backend Engineer',
    'Full Stack Developer',
    'Product Designer',
    'Data Analyst',
    'DevOps Engineer',
    'Machine Learning Engineer',
    'Growth Marketer',
    'QA Engineer',
    'Product Manager',
  ];

  const companies = ['Google', 'Meta', 'Amazon', 'Stripe', 'Vercel', 'Notion', 'Figma', 'Uber', 'Airbnb', 'Atlassian'];
  const locations = ['Remote', 'Hybrid - Bengaluru', 'On-site - Mumbai', 'Hybrid - Pune'];

  const jobs = [];
  for (let index = 0; index < 20; index += 1) {
    jobs.push({
      title: `${titles[index % titles.length]} ${index + 1}`,
      company: companies[index % companies.length],
      location: locations[index % locations.length],
      salary: `$${80 + index * 3}k`,
      skills: ['React', 'Node.js', 'MongoDB', 'System Design'].slice(0, (index % 4) + 1),
      postedAt: new Date(Date.now() - index * 1000 * 60 * 60 * 6),
    });
  }

  return jobs;
}

function buildCandidates() {
  const roles = ['Frontend Engineer', 'Product Designer', 'Data Analyst', 'Backend Engineer', 'Product Manager'];

  return Array.from({ length: 20 }).map((_, index) => ({
    name: `Candidate ${index + 1}`,
    role: roles[index % roles.length],
    matchScore: 52 + (index % 8) * 6,
    experience: ['Entry', 'Mid', 'Senior'][index % 3],
    skills: ['React', 'Node.js', 'SQL', 'Figma', 'AWS'].slice(0, (index % 5) + 1),
    headline: `Candidate ${index + 1} headline for public profile sharing`,
    bio: 'Public portfolio summary for profile pages and recruiter discovery.',
    avatar: '',
    profileSlug: `candidate-${index + 1}`,
    lastActive: new Date(Date.now() - (index + 1) * 1000 * 60 * 60 * 20),
    isTopCandidate: index % 5 === 0,
    isFinalist: index % 4 === 0,
  }));
}

function buildBlogPosts() {
  return [
    {
      title: 'Top React Interview Questions 2026',
      slug: 'top-react-interview-questions-2026',
      excerpt: 'The exact React questions candidates keep seeing in modern product interviews.',
      content: 'This guide covers hooks, rendering behavior, state management, performance optimization, and interview patterns for React roles in 2026. It is structured for fast revision and practical interview prep.',
      tags: ['React', 'Interview Prep', 'Frontend'],
      author: 'TalentNexus Editorial',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      readTime: 4,
    },
    {
      title: 'SDE Salary Trends in India',
      slug: 'sde-salary-trends-in-india',
      excerpt: 'Understand salary bands across companies, cities, and experience levels.',
      content: 'A practical salary analysis for software engineers in India with compensation ranges, negotiation notes, and the factors that affect offers at startups and large tech companies.',
      tags: ['Salary', 'India', 'SDE'],
      author: 'TalentNexus Editorial',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
      readTime: 5,
    },
    {
      title: 'How to Build Portfolio',
      slug: 'how-to-build-portfolio',
      excerpt: 'Turn scattered projects into a recruiter-friendly public portfolio.',
      content: 'This article explains how to pick projects, write case studies, surface measurable outcomes, and make your work easy to scan for recruiters and hiring managers.',
      tags: ['Portfolio', 'Personal Brand', 'Career'],
      author: 'TalentNexus Editorial',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      readTime: 6,
    },
    {
      title: 'Resume Tips That Improve ATS and Human Readability',
      slug: 'resume-tips-ats-human-readability',
      excerpt: 'Make your resume easier to skim for both ATS systems and hiring managers.',
      content: 'Strong resumes balance keywords with readability. This article explains how to format achievements, how to tailor bullet points, and how to keep your profile aligned with a target job description.',
      tags: ['Resume Tips', 'ATS', 'Portfolio'],
      author: 'TalentNexus Editorial',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      readTime: 6,
    },
    {
      title: 'Interview Prep: The 5 Signals Recruiters Notice First',
      slug: 'interview-prep-recruiter-signals',
      excerpt: 'A practical breakdown of how to structure your prep around signal quality, not random practice.',
      content: 'Recruiters notice clarity, role fit, communication, and consistency. This article explains how to convert prep time into interview-ready outcomes with evidence-based routines and reusable answer frameworks.',
      tags: ['Interview Prep', 'Career Growth', 'Recruiting'],
      author: 'TalentNexus Editorial',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      readTime: 4,
    },
  ];
}

function buildEvents() {
  return [
    {
      title: 'TalentNexus Buildathon',
      slug: 'talentnexus-buildathon',
      description: 'Build a job search or recruiting workflow in 48 hours with live mentor feedback.',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      participants: 284,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
      prizes: [
        { title: 'Winner', value: 'INR 50,000 + recruiter intros' },
        { title: 'Runner Up', value: 'INR 20,000 + platform credits' },
        { title: 'People Choice', value: 'Featured profile placement' },
      ],
    },
    {
      title: 'UI/UX Challenge',
      slug: 'ui-ux-challenge',
      description: 'Design a focused product experience and present your reasoning to judges.',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8),
      participants: 132,
      image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80',
      prizes: [
        { title: 'Winner', value: 'Design toolkit + mentorship' },
        { title: 'Finalists', value: 'Portfolio spotlight' },
      ],
    },
    {
      title: 'AI Hackathon',
      slug: 'ai-hackathon',
      description: 'Ship an AI-powered product prototype and compete on usefulness, polish, and execution.',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 22),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 19),
      participants: 412,
      image: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
      prizes: [
        { title: 'Winner', value: 'AI credits + cash prize' },
        { title: 'Top 5', value: 'Investor demo day access' },
      ],
    },
  ];
}

function createReferralCode(prefix) {
  const safePrefix = String(prefix).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'user';
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${safePrefix}-${suffix}`;
}

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Job.deleteMany({}),
    Product.deleteMany({}),
    Candidate.deleteMany({}),
    Application.deleteMany({}),
    Blog.deleteMany({}),
    Event.deleteMany({}),
  ]);

  const password = await bcrypt.hash(process.env.SEED_PASSWORD || 'Password@123', 12);

  const users = [];

  for (let index = 0; index < 12; index += 1) {
    users.push({
      name: `Candidate User ${index + 1}`,
      email: `candidate${index + 1}@talentnexus.com`,
      password,
      role: index % 2 === 0 ? 'candidate' : 'student',
      referralCode: createReferralCode(`cand${index + 1}`),
      referralStats: { invites: index % 4, successfulSignups: Math.floor(index / 3) },
    });
  }

  for (let index = 0; index < 3; index += 1) {
    users.push({
      name: `Recruiter ${index + 1}`,
      email: `recruiter${index + 1}@talentnexus.com`,
      password,
      role: 'recruiter',
      referralCode: createReferralCode(`rec${index + 1}`),
    });
  }

  users.push(
    { name: 'Admin User', email: 'admin@talentnexus.com', password, role: 'admin', referralCode: createReferralCode('admin') },
    { name: 'Employer User', email: 'employer@talentnexus.com', password, role: 'employer', referralCode: createReferralCode('employer') }
  );

  const insertedUsers = await User.insertMany(users);
  const jobs = await Job.insertMany(buildJobs());
  await Product.insertMany(buildProducts());
  await Candidate.insertMany(buildCandidates());
  await Blog.insertMany(buildBlogPosts());
  await Event.insertMany(buildEvents());

  const candidateUsers = insertedUsers.filter((user) => ['candidate', 'student'].includes(user.role));
  const statuses = ['Applied', 'Screening', 'Interviewing', 'Offer', 'Rejected', 'Hired'];
  const sources = ['TalentNexus', 'Referral', 'Career Page', 'LinkedIn'];

  const applications = Array.from({ length: 30 }).map((_, index) => ({
    user: candidateUsers[index % candidateUsers.length]._id,
    job: jobs[index % jobs.length]._id,
    status: statuses[index % statuses.length],
    source: sources[index % sources.length],
    createdAt: new Date(Date.now() - index * 1000 * 60 * 60 * 18),
    updatedAt: new Date(Date.now() - index * 1000 * 60 * 60 * 10),
  }));

  await Application.insertMany(applications);

  console.log('Seed completed successfully');
  console.log(`Users: ${insertedUsers.length}, Jobs: ${jobs.length}, Products: ${buildProducts().length}, Applications: ${applications.length}, Blogs: ${buildBlogPosts().length}, Events: ${buildEvents().length}`);

  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error('Seeding failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
