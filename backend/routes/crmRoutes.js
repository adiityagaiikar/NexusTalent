const express = require('express');
const { getCandidates } = require('../controllers/crmController');

const router = express.Router();

router.get('/candidates', getCandidates);

module.exports = router;
