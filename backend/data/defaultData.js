const jobs = [
  {
    title: 'SDE Intern',
    company: 'Google',
    location: 'Remote',
    salary: '$5k/mo',
    skills: ['React', 'Node.js', 'Testing'],
  },
  {
    title: 'Product Designer',
    company: 'Meta',
    location: 'Hybrid',
    salary: '$8k/mo',
    skills: ['Figma', 'Prototyping', 'UX Research'],
  },
  {
    title: 'Frontend Engineer',
    company: 'Vercel',
    location: 'Remote',
    salary: '$120k',
    skills: ['React', 'TypeScript', 'Tailwind'],
  },
];

const candidates = [
  {
    name: 'Arjun Mehta',
    role: 'Full Stack Developer',
    matchScore: 92,
    experience: 'Senior',
    skills: ['React', 'Node.js', 'MongoDB'],
    headline: 'Shipping full-stack product experiences with clean system design.',
    bio: 'Focus on scalable web apps, product thinking, and fast execution.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isTopCandidate: true,
    isFinalist: true,
  },
  {
    name: 'Sanya Iyer',
    role: 'UI/UX Designer',
    matchScore: 76,
    experience: 'Mid',
    skills: ['Figma', 'Prototyping', 'Research'],
    headline: 'Designing intuitive workflows with strong product intuition.',
    bio: 'Crafting polished interfaces and usable systems for SaaS products.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isTopCandidate: false,
    isFinalist: true,
  },
  {
    name: 'Rohan Das',
    role: 'DevOps Engineer',
    matchScore: 48,
    experience: 'Mid',
    skills: ['AWS', 'Docker', 'CI/CD'],
    headline: 'Infrastructure-focused engineer improving delivery and reliability.',
    bio: 'Strong in deployment automation, observability, and cloud operations.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    isTopCandidate: false,
    isFinalist: false,
  },
];

const products = [
  {
    slug: 'resume-intelligence-suite',
    title: 'Resume Intelligence Suite',
    name: 'Resume Intelligence Suite',
    category: 'Student Growth',
    price: 49,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'AI-powered resume feedback and optimization workflows.',
    description:
      'Build role-focused resumes with ATS scoring, instant feedback, and recruiter visibility insights.',
    rating: 4.7,
    reviewsCount: 2,
    features: ['ATS Analyzer', 'Keyword Gap Finder', 'Role-Based Templates'],
    reviews: [
      { name: 'Aman', rating: 5, comment: 'Helped me get 3 interview calls in one week.' },
      { name: 'Priya', rating: 4, comment: 'Great suggestions, especially role keyword matching.' },
    ],
    qna: [
      {
        question: 'Does this support product manager resumes?',
        answer: 'Yes, it includes PM-specific scoring dimensions and benchmarked examples.',
        askedBy: 'Ritika',
      },
    ],
  },
  {
    slug: 'crm-talent-pipeline-pro',
    title: 'CRM Talent Pipeline Pro',
    name: 'CRM Talent Pipeline Pro',
    category: 'Employer Hiring',
    price: 129,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Smart candidate lifecycle nurturing for recruiters.',
    description:
      'Track, score, and engage candidates with omnichannel nudges and high-signal priority alerts.',
    rating: 4.8,
    reviewsCount: 1,
    features: ['Predictive Match Score', 'Engagement Tracking', 'Nudge Automation'],
    reviews: [
      { name: 'Neel', rating: 5, comment: 'Our time-to-hire dropped significantly.' },
    ],
    qna: [
      {
        question: 'Can we export shortlisted candidates?',
        answer: 'Yes, CSV export and ATS sync are both supported.',
        askedBy: 'Aria',
      },
    ],
  },
  {
    slug: 'interview-prep-simulator',
    title: 'Interview Prep Simulator',
    name: 'Interview Prep Simulator',
    category: 'Student Growth',
    price: 59,
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Mock interviews with AI feedback loops.',
    description:
      'Run realistic technical and behavioral interview simulations with scoring and weak-area drills.',
    rating: 4.6,
    reviewsCount: 2,
    features: ['Live Practice Rounds', 'Behavioral Rubric', 'Improvement Roadmaps'],
    reviews: [
      { name: 'Sana', rating: 5, comment: 'Best interview prep workflow I have used.' },
      { name: 'Kunal', rating: 4, comment: 'Very practical feedback and confidence boosting.' },
    ],
    qna: [
      {
        question: 'Is this useful for freshers?',
        answer: 'Absolutely. It includes entry-level interview tracks and baseline coaching.',
        askedBy: 'Dev',
      },
    ],
  },
];

const trendingProjects = [
  {
    id: 1,
    tag: 'Web Design',
    title: 'Modern FinTech Dashboard',
    author: 'Alex Rivera',
    views: '1.2k',
    likes: 342,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    tag: '3D Animation',
    title: 'Spline Interactive Elements',
    author: 'Sarah Chen',
    views: '890',
    likes: 215,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    tag: 'Development',
    title: 'React E-Commerce Architecture',
    author: 'Marcus Doe',
    views: '2.4k',
    likes: 890,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80',
  },
];

const blogPosts = [
  {
    title: 'Top React Interview Questions 2026',
    slug: 'top-react-interview-questions-2026',
    excerpt: 'The exact React questions candidates keep seeing in modern product interviews.',
    content:
      'This guide covers hooks, rendering behavior, state management, performance optimization, and interview patterns for React roles in 2026. It is structured for fast revision and practical interview prep.',
    tags: ['React', 'Interview Prep', 'Frontend'],
    author: 'TalentNexus Editorial',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    readTime: 4,
  },
  {
    title: 'SDE Salary Trends in India',
    slug: 'sde-salary-trends-in-india',
    excerpt: 'Understand salary bands across companies, cities, and experience levels.',
    content:
      'A practical salary analysis for software engineers in India with compensation ranges, negotiation notes, and the factors that affect offers at startups and large tech companies.',
    tags: ['Salary', 'India', 'SDE'],
    author: 'TalentNexus Editorial',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    readTime: 5,
  },
  {
    title: 'How to Build Portfolio',
    slug: 'how-to-build-portfolio',
    excerpt: 'Turn scattered projects into a recruiter-friendly public portfolio.',
    content:
      'This article explains how to pick projects, write case studies, surface measurable outcomes, and make your work easy to scan for recruiters and hiring managers.',
    tags: ['Portfolio', 'Personal Brand', 'Career'],
    author: 'TalentNexus Editorial',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    readTime: 6,
  },
  {
    title: 'Resume Tips That Improve ATS and Human Readability',
    slug: 'resume-tips-ats-human-readability',
    excerpt: 'Make your resume easier to skim for both ATS systems and hiring managers.',
    content:
      'Strong resumes balance keywords with readability. This article explains how to format achievements, how to tailor bullet points, and how to keep your profile aligned with a target job description.',
    tags: ['Resume Tips', 'ATS', 'Portfolio'],
    author: 'TalentNexus Editorial',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    readTime: 6,
  },
  {
    title: 'Interview Prep: The 5 Signals Recruiters Notice First',
    slug: 'interview-prep-recruiter-signals',
    excerpt: 'A practical breakdown of how to structure your prep around signal quality, not random practice.',
    content:
      'Recruiters notice clarity, role fit, communication, and consistency. This article explains how to convert prep time into interview-ready outcomes with evidence-based routines and reusable answer frameworks.',
    tags: ['Interview Prep', 'Career Growth', 'Recruiting'],
    author: 'TalentNexus Editorial',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    readTime: 4,
  },
];

const events = [
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

module.exports = {
  jobs,
  candidates,
  products,
  blogPosts,
  events,
  trendingProjects,
};
