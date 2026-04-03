const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function ensureDefaultUsers() {
  const usersCount = await User.countDocuments();
  if (usersCount > 0) return;

  const hashedPassword = await bcrypt.hash('Password@123', 12);

  await User.insertMany([
    {
      name: 'Demo Employer',
      email: 'employer@talentnexus.com',
      password: hashedPassword,
      role: 'employer',
    },
    {
      name: 'Demo Student',
      email: 'student@talentnexus.com',
      password: hashedPassword,
      role: 'student',
    },
  ]);
}

async function bootstrapData() {
  await ensureDefaultUsers();
}

module.exports = {
  bootstrapData,
};
