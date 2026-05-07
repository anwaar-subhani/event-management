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
const requireOrganizerAdmin = require('../middleware/requireOrganizerAdmin');

const router = express.Router();

// Public blogs
router.get('/', getAllBlogs);

// Admin blogs and CRUD
router.get('/admin', requireOrganizerAuth, requireOrganizerAdmin, getAdminBlogs);
router.post('/', requireOrganizerAuth, requireOrganizerAdmin, createBlog);
router.patch('/:blogId', requireOrganizerAuth, requireOrganizerAdmin, updateBlog);
router.delete('/:blogId', requireOrganizerAuth, requireOrganizerAdmin, deleteBlog);

router.get('/:blogId', getBlogById);

module.exports = router;
