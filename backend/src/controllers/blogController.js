const mongoose = require('mongoose');
const Blog = require('../models/Blog');

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function parseBoolean(value, defaultValue) {
  if (value === undefined) return defaultValue;
  if (typeof value === 'boolean') return value;

  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return defaultValue;
}

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
  const { blogId } = req.params;

  if (!isValidObjectId(blogId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog id',
      data: null
    });
  }

  try {
    const blog = await Blog.findOne({
      _id: blogId,
      isActive: true,
      isPublished: true
    }).select('-__v');

    if (!blog) {
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
    const blogs = await Blog.find({ isActive: true })
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

async function createBlog(req, res) {
  const { title, description, content, image, author, readTimeMinutes, isPublished, isActive } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required',
      data: null
    });
  }

  if (readTimeMinutes !== undefined && Number(readTimeMinutes) < 1) {
    return res.status(400).json({
      success: false,
      message: 'Read time must be at least 1 minute',
      data: null
    });
  }

  try {
    const blog = await Blog.create({
      title,
      description,
      content,
      image,
      author,
      readTimeMinutes: readTimeMinutes !== undefined ? Number(readTimeMinutes) : undefined,
      isPublished: parseBoolean(isPublished, true),
      isActive: parseBoolean(isActive, true)
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
  const { blogId } = req.params;

  if (!isValidObjectId(blogId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog id',
      data: null
    });
  }

  const allowedFields = [
    'title',
    'description',
    'content',
    'image',
    'author',
    'readTimeMinutes',
    'isPublished',
    'isActive'
  ];

  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (updates.readTimeMinutes !== undefined && Number(updates.readTimeMinutes) < 1) {
    return res.status(400).json({
      success: false,
      message: 'Read time must be at least 1 minute',
      data: null
    });
  }

  try {
    const blog = await Blog.findById(blogId);

    if (!blog || !blog.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
        data: null
      });
    }

    if (updates.readTimeMinutes !== undefined) {
      updates.readTimeMinutes = Number(updates.readTimeMinutes);
    }

    if (updates.isPublished !== undefined) {
      updates.isPublished = parseBoolean(updates.isPublished, blog.isPublished);
    }

    if (updates.isActive !== undefined) {
      updates.isActive = parseBoolean(updates.isActive, blog.isActive);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updates, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: { blog: updatedBlog }
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
  const { blogId } = req.params;

  if (!isValidObjectId(blogId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid blog id',
      data: null
    });
  }

  try {
    const blog = await Blog.findById(blogId);

    if (!blog || !blog.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
        data: null
      });
    }

    blog.isActive = false;
    await blog.save();

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      data: { blogId: blog._id }
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
