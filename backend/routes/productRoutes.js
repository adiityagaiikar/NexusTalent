const express = require('express');
const {
  getProducts,
  createProduct,
  getProductById,
  getProductBySlug,
  addReview,
  addQuestion,
  getAiInsights,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getProducts).post(protect, createProduct);
router.get('/slug/:slug', getProductBySlug);
router.post('/slug/:slug/reviews', addReview);
router.post('/slug/:slug/questions', addQuestion);
router.get('/slug/:slug/ai-insights', getAiInsights);
router.get('/:id', getProductById);

module.exports = router;
