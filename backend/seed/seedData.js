require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Product = require('../models/Product');
const { jobs, candidates, products } = require('../data/defaultData');

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Job.deleteMany({}),
    Candidate.deleteMany({}),
    Product.deleteMany({}),
  ]);

  const password = await bcrypt.hash('Password@123', 12);

  await User.insertMany([
    {
      name: 'Admin Employer',
      email: 'employer@talentnexus.com',
      password,
      role: 'employer',
    },
    {
      name: 'Student User',
      email: 'student@talentnexus.com',
      password,
      role: 'student',
    },
  ]);

  await Job.insertMany(jobs);
  await Candidate.insertMany(candidates);
  await Product.insertMany(products);

  console.log('Seed data inserted successfully');
  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error('Seeding failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
