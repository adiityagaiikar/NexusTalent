const Candidate = require('../models/Candidate');
const Application = require('../models/Application');
const { candidates: defaultCandidates } = require('../data/defaultData');

async function getCandidates(req, res, next) {
  try {
    const count = await Candidate.countDocuments();
    if (count === 0) {
      await Candidate.insertMany(defaultCandidates);
    }

    const candidates = await Candidate.find(
      {},
      {
        name: 1,
        role: 1,
        matchScore: 1,
        lastActive: 1,
        isTopCandidate: 1,
        isFinalist: 1,
      }
    ).sort({ matchScore: -1, lastActive: -1 });

    return res.status(200).json(candidates);
  } catch (error) {
    return next(error);
  }
}

function daysSince(dateValue) {
  const diff = Date.now() - new Date(dateValue).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

async function getOverview(req, res, next) {
  try {
    const [candidates, applications] = await Promise.all([
      Candidate.find({}, { name: 1, role: 1, matchScore: 1, lastActive: 1, isTopCandidate: 1 }).sort({ matchScore: -1 }),
      Application.find({}, { status: 1, createdAt: 1, updatedAt: 1, source: 1 }).sort({ createdAt: -1 }).limit(200),
    ]);

    const totalApplications = applications.length;
    const hired = applications.filter((item) => item.status === 'Hired').length;
    const rejected = applications.filter((item) => item.status === 'Rejected').length;
    const conversionRate = totalApplications ? Math.round((hired / totalApplications) * 100) : 0;
    const dropOffRate = totalApplications ? Math.round((rejected / totalApplications) * 100) : 0;

    const hiredApps = applications.filter((item) => item.status === 'Hired');
    const avgTimeToHire = hiredApps.length
      ? Math.round(
          hiredApps.reduce((sum, app) => sum + daysSince(app.createdAt), 0) / hiredApps.length
        )
      : 0;

    const atRiskCandidates = candidates
      .filter((candidate) => daysSince(candidate.lastActive) > 5)
      .slice(0, 8)
      .map((candidate) => ({
        id: candidate._id,
        name: candidate.name,
        role: candidate.role,
        daysInactive: daysSince(candidate.lastActive),
      }));

    const topTalent = candidates
      .filter((candidate) => candidate.matchScore >= 85 || candidate.isTopCandidate)
      .slice(0, 8)
      .map((candidate) => ({
        id: candidate._id,
        name: candidate.name,
        role: candidate.role,
        matchScore: candidate.matchScore,
      }));

    const activityFeed = applications.slice(0, 12).map((item, index) => ({
      id: `${item._id}-${index}`,
      action: item.status,
      source: item.source,
      time: item.updatedAt || item.createdAt,
    }));

    const weeklyMap = new Map();
    const monthlyMap = new Map();

    applications.forEach((item) => {
      const date = new Date(item.createdAt);
      const weekLabel = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6) / 7)}`;
      const monthLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      weeklyMap.set(weekLabel, (weeklyMap.get(weekLabel) || 0) + 1);
      monthlyMap.set(monthLabel, (monthlyMap.get(monthLabel) || 0) + 1);
    });

    const weekly = Array.from(weeklyMap.entries())
      .slice(-8)
      .map(([label, count]) => ({ label, count }));
    const monthly = Array.from(monthlyMap.entries())
      .slice(-6)
      .map(([label, count]) => ({ label, count }));

    return res.status(200).json({
      message: 'CRM overview fetched successfully',
      data: {
        analytics: {
          conversionRate,
          avgTimeToHire,
          dropOffRate,
        },
        atRiskCandidates,
        topTalent,
        activityFeed,
        trends: {
          weekly,
          monthly,
        },
      },
    });
  } catch (error) {
    console.error('getOverview error:', error);
    return next(error);
  }
}

module.exports = {
  getCandidates,
  getOverview,
};
