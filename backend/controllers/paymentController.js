const crypto = require('crypto');
const Razorpay = require('razorpay');
const PlatformStats = require('../models/PlatformStats');

function getRazorpayClient() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

async function getOrCreateStats() {
  let stats = await PlatformStats.findOne();

  if (!stats) {
    stats = await PlatformStats.create({
      totalEarnings: 0,
      totalTransactions: 0,
    });
  }

  return stats;
}

async function createOrder(req, res, next) {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'amount must be greater than 0' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys are not configured on the server' });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount)),
      currency,
      receipt: receipt || `tnx-${Date.now()}`,
    });

    return res.status(201).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
    });
  } catch (error) {
    return next(error);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount) {
      return res.status(400).json({ message: 'Invalid payment verification payload' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(401).json({ message: 'Signature verification failed' });
    }

    const revenue = Number(amount) * 0.1;
    const stats = await getOrCreateStats();

    stats.totalEarnings = Number((stats.totalEarnings + revenue).toFixed(2));
    stats.totalTransactions += 1;

    await stats.save();

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      platformRevenue: Number(revenue.toFixed(2)),
      stats: {
        totalEarnings: stats.totalEarnings,
        totalTransactions: stats.totalTransactions,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function getPaymentStats(req, res, next) {
  try {
    const stats = await getOrCreateStats();

    return res.status(200).json({
      totalEarnings: stats.totalEarnings,
      totalTransactions: stats.totalTransactions,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentStats,
};
