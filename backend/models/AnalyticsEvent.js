const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['profile_view', 'job_click'],
      required: true,
      index: true,
    },
    targetId: { type: String, required: true, index: true },
    userId: { type: String, default: '' },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
