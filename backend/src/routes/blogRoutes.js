const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Blog = require('../models/Blog');

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const blogs = await Blog.find({ published: true })
      .populate('author', 'firstName lastName avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments({ published: true });

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
});

// Get blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'firstName lastName avatar');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
});

// Create blog post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, featured_image } = req.body;

    const blog = new Blog({
      title,
      content,
      excerpt,
      category,
      tags,
      featured_image,
      author: req.userId,
      published: false
    });

    await blog.save();
    await blog.populate('author', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
});

module.exports = router;
