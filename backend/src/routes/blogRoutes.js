const express = require('express');
const { getAllBlogs } = require('../controllers/blogController');

const router = express.Router();

// Public blogs
router.get('/', getAllBlogs);

module.exports = router;
