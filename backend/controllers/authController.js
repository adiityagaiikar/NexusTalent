const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const ALLOWED_ROLES = ['student', 'candidate', 'employer', 'recruiter', 'admin'];

function slugifyName(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function createReferralCode(name) {
  const base = slugifyName(name).slice(0, 12) || 'user';
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${base}-${suffix}`;
}

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password, role, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode: String(referralCode).trim() });
      if (!referrer) {
        return res.status(400).json({ message: 'Invalid referral code' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const createdUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'student',
      referralCode: createReferralCode(name),
      referredBy: referralCode ? String(referralCode).trim() : '',
    });

    if (referrer) {
      referrer.referralStats.successfulSignups += 1;
      await referrer.save();
    }

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        referralCode: createdUser.referralCode,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Current user fetched successfully',
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  me,
};
