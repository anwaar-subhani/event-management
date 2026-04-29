const Blog = require('../models/Blog');

async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.find({ isActive: true, isPublished: true })
      .sort({ createdAt: -1 })
      .select('-__v');

    return res.status(200).json({
      success: true,
      message: 'Blogs fetched successfully',
      data: { blogs }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      data: null
    });
  }
}

module.exports = {
  getAllBlogs
};
