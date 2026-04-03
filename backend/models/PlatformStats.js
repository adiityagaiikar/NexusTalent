const mongoose = require('mongoose');

const platformStatsSchema = new mongoose.Schema(
  {
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTransactions: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('PlatformStats', platformStatsSchema);
