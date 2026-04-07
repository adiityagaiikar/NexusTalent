const User = require('../models/User');
const AnalyticsEvent = require('../models/AnalyticsEvent');

async function getPublicUserProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [profileViews, jobClicks] = await Promise.all([
      AnalyticsEvent.countDocuments({ type: 'profile_view', targetId: String(user._id) }),
      AnalyticsEvent.countDocuments({ type: 'job_click', userId: String(user._id) }),
    ]);

    return res.status(200).json({
      message: 'Public profile fetched successfully',
      data: {
        ...user.toObject(),
        analytics: {
          profileViews,
          jobClicks,
        },
      },
    });
  } catch (error) {
    console.error('getPublicUserProfile error:', error);
    return next(error);
  }
}

async function getReferralStats(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('referralCode referralStats');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Referral stats fetched successfully',
      data: user,
    });
  } catch (error) {
    console.error('getReferralStats error:', error);
    return next(error);
  }
}

async function trackInvite(req, res, next) {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({ message: 'referralCode is required' });
    }

    const user = await User.findOneAndUpdate(
      { referralCode },
      { $inc: { 'referralStats.invites': 1 } },
      { new: true }
    ).select('referralCode referralStats');

    if (!user) {
      return res.status(404).json({ message: 'Referral code not found' });
    }

    return res.status(200).json({
      message: 'Invite tracked successfully',
      data: user,
    });
  } catch (error) {
    console.error('trackInvite error:', error);
    return next(error);
  }
}

module.exports = {
  getPublicUserProfile,
  getReferralStats,
  trackInvite,
};
