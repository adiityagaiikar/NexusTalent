const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 600 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const qnaSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 400 },
    answer: { type: String, trim: true, maxlength: 600, default: '' },
    askedBy: { type: String, required: true, trim: true, maxlength: 80 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    name: { type: String, trim: true, maxlength: 120 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, trim: true, default: '' },
    shortDescription: { type: String, required: true, trim: true, maxlength: 220 },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    features: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    reviews: { type: [reviewSchema], default: [] },
    qna: { type: [qnaSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.pre('validate', function syncLegacyName(next) {
  if (!this.name && this.title) {
    this.name = this.title;
  }
  if (!this.title && this.name) {
    this.title = this.name;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
