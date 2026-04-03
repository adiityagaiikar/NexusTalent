const Job = require('../models/Job');
const { jobs: defaultJobs } = require('../data/defaultData');

async function getJobs(req, res, next) {
  try {
    const count = await Job.countDocuments();
    if (count === 0) {
      await Job.insertMany(defaultJobs);
    }

    const jobs = await Job.find(
      {},
      {
        title: 1,
        company: 1,
        location: 1,
        salary: 1,
        skills: 1,
        postedAt: 1,
      }
    ).sort({ postedAt: -1 });

    return res.status(200).json(jobs);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getJobs,
};
