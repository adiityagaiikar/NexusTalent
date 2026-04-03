const Candidate = require('../models/Candidate');
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

module.exports = {
  getCandidates,
};
