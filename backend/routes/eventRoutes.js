const express = require('express');
const { getEvents, getEventById, createEvent, registerEvent } = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getEvents);
router.post('/register', protect, registerEvent);
router.post('/', protect, authorizeRoles('admin'), createEvent);
router.get('/:id', getEventById);

module.exports = router;
