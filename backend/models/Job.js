const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    salary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    skills: {
      type: [String],
      default: [],
    },
    postedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('Job', jobSchema);
