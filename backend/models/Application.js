const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Screening', 'Interviewing', 'Offer', 'Rejected', 'Hired'],
      default: 'Applied',
      index: true,
    },
    source: {
      type: String,
      enum: ['TalentNexus', 'Referral', 'Career Page', 'LinkedIn'],
      default: 'TalentNexus',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

module.exports = mongoose.model('Application', applicationSchema);
