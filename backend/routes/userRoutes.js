const express = require('express');
const { getPublicUserProfile, getReferralStats, trackInvite } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me/referrals', protect, getReferralStats);
router.post('/referrals/invite', protect, trackInvite);
router.get('/:id', getPublicUserProfile);

module.exports = router;
