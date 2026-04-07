const express = require('express');
const { getBlogs, getBlogById, createBlog, deleteBlog } = require('../controllers/blogController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlogById);
router.post('/', protect, authorizeRoles('admin'), createBlog);
router.delete('/:id', protect, authorizeRoles('admin'), deleteBlog);

module.exports = router;