const express = require('express');
const { getCandidates, getOverview } = require('../controllers/crmController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/candidates', getCandidates);
router.get('/overview', getOverview);

module.exports = router;
