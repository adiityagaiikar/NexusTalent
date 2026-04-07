const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true, trim: true, maxlength: 10000 },
    tags: { type: [String], default: [] },
    author: { type: String, required: true, trim: true, maxlength: 100 },
    excerpt: { type: String, required: true, trim: true, maxlength: 280 },
    readTime: { type: Number, default: 4, min: 1 },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);
