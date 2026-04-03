const express = require('express');
const {
  getProducts,
  getProductBySlug,
  addReview,
  addQuestion,
  getAiInsights,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/:slug/reviews', addReview);
router.post('/:slug/questions', addQuestion);
router.get('/:slug/ai-insights', getAiInsights);

module.exports = router;
