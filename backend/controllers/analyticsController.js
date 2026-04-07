const AnalyticsEvent = require('../models/AnalyticsEvent');

async function trackEvent(req, res, next) {
  try {
    const { type, targetId, userId = '', metadata = {} } = req.body;

    if (!type || !targetId) {
      return res.status(400).json({ message: 'type and targetId are required' });
    }

    if (!['profile_view', 'job_click'].includes(type)) {
      return res.status(400).json({ message: 'Invalid analytics event type' });
    }

    const event = await AnalyticsEvent.create({
      type,
      targetId: String(targetId),
      userId: String(userId),
      metadata,
    });

    return res.status(201).json({ message: 'Analytics event tracked successfully', data: event });
  } catch (error) {
    console.error('trackEvent error:', error);
    return next(error);
  }
}

module.exports = {
  trackEvent,
};
