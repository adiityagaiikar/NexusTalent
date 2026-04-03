const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    lastActive: {
      type: Date,
      required: true,
    },
    isTopCandidate: {
      type: Boolean,
      default: false,
    },
    isFinalist: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Candidate', candidateSchema);
