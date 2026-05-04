const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const projects = await Project.find(filter)
      .populate('owner', 'firstName lastName avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(filter);

    res.json({
      success: true,
      projects,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
});

// Search projects (MUST be before /:id to avoid route conflict)
router.get('/search/:query', async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { title: { $regex: req.params.query, $options: 'i' } },
        { description: { $regex: req.params.query, $options: 'i' } },
        { category: { $regex: req.params.query, $options: 'i' } }
      ]
    }).populate('owner', 'firstName lastName avatar');

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching projects',
      error: error.message
    });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'firstName lastName avatar email')
      .populate('lenders.lenderId', 'firstName lastName avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message
    });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, targetAmount, interestRate, duration, location, images, status } = req.body;

    const project = new Project({
      title,
      description,
      category,
      targetAmount,
      interestRate,
      duration,
      location,
      images,
      status: status || 'draft',
      owner: req.userId
    });

    await project.save();
    await project.populate('owner', 'firstName lastName avatar');

    // Create notifications for other users
    const Notification = require('../models/Notification');
    const User = require('../models/User');
    
    // Find all active users except the project creator
    const usersToNotify = await User.find({ 
      _id: { $ne: req.userId },
      isActive: true 
    });

    if (usersToNotify.length > 0) {
      const notifications = usersToNotify.map(user => ({
        userId: user._id,
        type: 'project_update',
        title: 'New Project Opportunity!',
        message: `A new project "${project.title}" has just been launched in the market. Check it out!`,
        relatedId: { projectId: project._id },
        priority: 'medium',
        isRead: false
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message
    });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    Object.assign(project, req.body);
    await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message
    });
  }
});

module.exports = router;
