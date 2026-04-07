const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    date: { type: Date, required: true },
    deadline: { type: Date, required: true },
    participants: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '', trim: true },
    prizes: {
      type: [
        {
          title: { type: String, required: true, trim: true },
          value: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },
    registrations: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
          registeredAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Event', eventSchema);
