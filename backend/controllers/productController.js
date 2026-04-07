const Product = require('../models/Product');
const { products: defaultProducts } = require('../data/defaultData');

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function ensureProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(defaultProducts);
  }
}

function computeAverageRating(reviews) {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

function createAiSummary(product) {
  const topFeature = product.features[0] || 'Core workflow support';
  const sentiment = product.rating >= 4.5 ? 'very positive' : product.rating >= 3.8 ? 'positive' : 'mixed';
  const unansweredQuestions = product.qna.filter((item) => !item.answer).length;

  return {
    confidence: product.rating >= 4.5 ? 'high' : 'medium',
    summary: `User sentiment is ${sentiment}. Strongest value signal: ${topFeature}.`,
    recommendations: [
      unansweredQuestions > 0
        ? 'Answer open product questions to improve buyer confidence.'
        : 'Q&A response quality looks healthy.',
      product.reviewsCount < 5
        ? 'Collect more verified reviews to improve trust signals.'
        : 'Review coverage is strong across use-cases.',
      'Highlight role-specific use-cases in product messaging.',
    ],
  };
}

async function getProducts(req, res, next) {
  try {
    await ensureProducts();
    const products = await Product.find(
      {},
      {
        title: 1,
        name: 1,
        slug: 1,
        category: 1,
        shortDescription: 1,
        description: 1,
        price: 1,
        image: 1,
        rating: 1,
        reviewsCount: 1,
        features: 1,
        createdAt: 1,
      }
    ).sort({ rating: -1, createdAt: -1 });

    return res.status(200).json({ message: 'Products fetched successfully', data: products });
  } catch (error) {
    console.error('getProducts error:', error);
    return next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { title, description, price, category, image, shortDescription, features } = req.body;

    if (!title || !description || typeof price !== 'number' || !category) {
      return res.status(400).json({
        message: 'title, description, price (number), and category are required',
      });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'price must be greater than or equal to 0' });
    }

    const slug = slugify(title);
    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'Product with similar title already exists' });
    }

    const product = await Product.create({
      title: String(title).trim(),
      name: String(title).trim(),
      slug,
      description: String(description).trim(),
      shortDescription: String(shortDescription || description).trim().slice(0, 220),
      price,
      category: String(category).trim(),
      image: String(image || '').trim(),
      features: Array.isArray(features) ? features.map((item) => String(item).trim()).filter(Boolean) : [],
    });

    return res.status(201).json({ message: 'Product created successfully', data: product });
  } catch (error) {
    console.error('createProduct error:', error);
    return next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product fetched successfully', data: product });
  } catch (error) {
    console.error('getProductById error:', error);
    return next(error);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    await ensureProducts();
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product fetched successfully', data: product });
  } catch (error) {
    console.error('getProductBySlug error:', error);
    return next(error);
  }
}

async function addReview(req, res, next) {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'name, rating and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'rating must be between 1 and 5' });
    }

    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.reviews.unshift({
      name: String(name).trim(),
      rating: Number(rating),
      comment: String(comment).trim(),
    });

    product.reviewsCount = product.reviews.length;
    product.rating = computeAverageRating(product.reviews);

    await product.save();

    return res.status(201).json({
      message: 'Review added successfully',
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      reviews: product.reviews,
    });
  } catch (error) {
    console.error('addReview error:', error);
    return next(error);
  }
}

async function addQuestion(req, res, next) {
  try {
    const { name, question } = req.body;

    if (!name || !question) {
      return res.status(400).json({ message: 'name and question are required' });
    }

    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.qna.unshift({
      askedBy: String(name).trim(),
      question: String(question).trim(),
      answer: '',
    });

    await product.save();

    return res.status(201).json({
      message: 'Question submitted successfully',
      qna: product.qna,
    });
  } catch (error) {
    console.error('addQuestion error:', error);
    return next(error);
  }
}

async function getAiInsights(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'AI insights generated', data: createAiSummary(product) });
  } catch (error) {
    console.error('getAiInsights error:', error);
    return next(error);
  }
}

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  getProductBySlug,
  addReview,
  addQuestion,
  getAiInsights,
};
