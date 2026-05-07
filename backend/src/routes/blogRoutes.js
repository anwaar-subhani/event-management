const express = require('express');
const {
	getAllBlogs,
	getBlogById,
	getAdminBlogs,
	createBlog,
	updateBlog,
	deleteBlog
} = require('../controllers/blogController');
const requireOrganizerAuth = require('../middleware/requireOrganizerAuth');

const router = express.Router();

// Organizer blogs
router.get('/admin', requireOrganizerAuth, getAdminBlogs);
router.post('/', requireOrganizerAuth, createBlog);
router.patch('/:blogId', requireOrganizerAuth, updateBlog);
router.delete('/:blogId', requireOrganizerAuth, deleteBlog);

// Public blogs
router.get('/', getAllBlogs);
router.get('/:blogId', getBlogById);

module.exports = router;
