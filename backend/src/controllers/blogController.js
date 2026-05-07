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

async function getBlogById(req, res) {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).select('-__v');

    if (!blog || !blog.isActive || !blog.isPublished) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog fetched successfully',
      data: { blog }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      data: null
    });
  }
}

async function getAdminBlogs(req, res) {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    return res.status(200).json({
      success: true,
      message: 'Admin blogs fetched successfully',
      data: { blogs }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin blogs',
      data: null
    });
  }
}

function parseBoolean(value, defaultValue) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return defaultValue;
}

async function createBlog(req, res) {
  try {
    const title = String(req.body.title || '').trim();
    const description = String(req.body.description || '').trim();

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required',
        data: null
      });
    }

    const blog = await Blog.create({
      title,
      description,
      content: String(req.body.content || '').trim(),
      image: String(req.body.image || '').trim(),
      author: String(req.body.author || 'Event Team').trim() || 'Event Team',
      readTimeMinutes: Math.max(1, Number(req.body.readTimeMinutes) || 5),
      isPublished: parseBoolean(req.body.isPublished, true),
      isActive: parseBoolean(req.body.isActive, true)
    });

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create blog',
      data: null
    });
  }
}

async function updateBlog(req, res) {
  try {
    const { blogId } = req.params;

    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
        data: null
      });
    }

    const updates = {};

    if (req.body.title !== undefined) updates.title = String(req.body.title || '').trim();
    if (req.body.description !== undefined) updates.description = String(req.body.description || '').trim();
    if (req.body.content !== undefined) updates.content = String(req.body.content || '').trim();
    if (req.body.image !== undefined) updates.image = String(req.body.image || '').trim();
    if (req.body.author !== undefined) updates.author = String(req.body.author || '').trim() || 'Event Team';
    if (req.body.readTimeMinutes !== undefined) {
      updates.readTimeMinutes = Math.max(1, Number(req.body.readTimeMinutes) || 1);
    }
    if (req.body.isPublished !== undefined) updates.isPublished = parseBoolean(req.body.isPublished, existingBlog.isPublished);
    if (req.body.isActive !== undefined) updates.isActive = parseBoolean(req.body.isActive, existingBlog.isActive);

    if (updates.title !== undefined && !updates.title) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty',
        data: null
      });
    }

    if (updates.description !== undefined && !updates.description) {
      return res.status(400).json({
        success: false,
        message: 'Description cannot be empty',
        data: null
      });
    }

    const blog = await Blog.findByIdAndUpdate(blogId, updates, {
      new: true,
      runValidators: true
    }).select('-__v');

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog',
      data: null
    });
  }
}

async function deleteBlog(req, res) {
  try {
    const { blogId } = req.params;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: { blog: deletedBlog }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
      data: null
    });
  }
}

module.exports = {
  getAllBlogs,
  getBlogById,
  getAdminBlogs,
  createBlog,
  updateBlog,
  deleteBlog
};
