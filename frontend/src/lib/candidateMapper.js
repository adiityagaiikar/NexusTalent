function getStatusFromLastActive(lastActiveDate) {
  const now = new Date();
  const lastActive = new Date(lastActiveDate);
  const diffMs = now.getTime() - lastActive.getTime();
  const hours = diffMs / (1000 * 60 * 60);

  if (hours <= 48) return 'Active';
  if (hours <= 120) return 'Needs Follow-up';
  return 'Dormant';
}

function toRelativeTime(lastActiveDate) {
  const now = new Date();
  const lastActive = new Date(lastActiveDate);
  const diffMs = now.getTime() - lastActive.getTime();
  const mins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function mapCandidateToCard(candidate, index = 0) {
  return {
    id: candidate._id,
    name: candidate.name,
    role: candidate.role,
    matchScore: candidate.matchScore,
    lastActive: toRelativeTime(candidate.lastActive),
    status: getStatusFromLastActive(candidate.lastActive),
    isTopPick: candidate.isTopCandidate,
    isFastResponder: candidate.matchScore >= 75,
    isFinalist: candidate.isFinalist,
    contactPreference: index % 2 === 0 ? 'email' : 'whatsapp',
    scoreBreakdown: {
      skills: Math.min(candidate.matchScore + 4, 99),
      culture: Math.max(candidate.matchScore - 5, 45),
      responsiveness: Math.max(candidate.matchScore - 2, 40),
    },
    skills: candidate.skills || ['Communication', 'Ownership', 'Collaboration'],
    rate: '$55/hr',
    exp: candidate.experience || '4y',
    rating: Math.max(4.2, Math.min(5, candidate.matchScore / 20)),
    img:
      candidate.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=220&q=80',
    headline: candidate.headline,
    bio: candidate.bio,
    publicProfilePath: `/user/${candidate._id}`,
  };
}
