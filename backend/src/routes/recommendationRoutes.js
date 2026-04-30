const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');
const RecommendationService = require('../services/recommendationService');
const Loan = require('../models/Loan');

// Get personalized recommendations
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // Get all active projects
    const activeProjects = await Project.find({ status: 'active' })
      .populate('owner', 'firstName lastName avatar');

    // Generate recommendations
    const recommendations = RecommendationService.generateRecommendations(
      user,
      activeProjects,
      10
    );

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
});

// Get personalized recommendations based on history
router.get('/personalized', auth, async (req, res) => {
  try {
    // Get user's loans
    const userLoans = await Loan.find({ lender: req.userId })
      .populate('project');

    // Get all projects
    const allProjects = await Project.find({ status: 'active' })
      .populate('owner', 'firstName lastName avatar');

    // Get personalized recommendations
    const recommendations = await RecommendationService.getPersonalizedRecommendations(
      req.userId,
      userLoans,
      allProjects
    );

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching personalized recommendations',
      error: error.message
    });
  }
});

module.exports = router;
