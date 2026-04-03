const express = require('express');
const {
  createOrder,
  verifyPayment,
  getPaymentStats,
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/stats', getPaymentStats);

module.exports = router;
