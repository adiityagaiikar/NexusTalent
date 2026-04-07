const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    content: { type: String, required: true, trim: true, maxlength: 20000 },
    author: { type: String, required: true, trim: true, maxlength: 100 },
    tags: { type: [String], default: [] },
    image: { type: String, default: '', trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    readTime: { type: Number, default: 4, min: 1 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);