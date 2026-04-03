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
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isTopCandidate: true,
    isFinalist: true,
  },
  {
    name: 'Sanya Iyer',
    role: 'UI/UX Designer',
    matchScore: 76,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isTopCandidate: false,
    isFinalist: true,
  },
  {
    name: 'Rohan Das',
    role: 'DevOps Engineer',
    matchScore: 48,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    isTopCandidate: false,
    isFinalist: false,
  },
];

const products = [
  {
    slug: 'resume-intelligence-suite',
    name: 'Resume Intelligence Suite',
    category: 'Student Growth',
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
    name: 'CRM Talent Pipeline Pro',
    category: 'Employer Hiring',
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
    name: 'Interview Prep Simulator',
    category: 'Student Growth',
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

module.exports = {
  jobs,
  candidates,
  products,
  trendingProjects,
};
