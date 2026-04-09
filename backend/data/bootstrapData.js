const bcrypt = require('bcryptjs');
const User = require('../models/User');

function createReferralCode(prefix) {
  const safePrefix = String(prefix).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'user';
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${safePrefix}-${suffix}`;
}

async function ensureDefaultUsers() {
  const hashedPassword = await bcrypt.hash('Password@123', 12);

  await Promise.all([
    User.findOneAndUpdate(
      { email: 'admin@talentnexus.com' },
      {
        $set: {
          name: 'Demo Admin',
          password: hashedPassword,
          role: 'admin',
          referralCode: createReferralCode('admin'),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
    User.findOneAndUpdate(
      { email: 'employer@talentnexus.com' },
      {
        $set: {
          name: 'Demo Employer',
          password: hashedPassword,
          role: 'employer',
          referralCode: createReferralCode('employer'),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
    User.findOneAndUpdate(
      { email: 'student@talentnexus.com' },
      {
        $set: {
          name: 'Demo Student',
          password: hashedPassword,
          role: 'student',
          referralCode: createReferralCode('student'),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
  ]);
}

async function bootstrapData() {
  await ensureDefaultUsers();
}

module.exports = {
  bootstrapData,
};
