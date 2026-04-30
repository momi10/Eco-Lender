const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Loan = require('../models/Loan');
const User = require('../models/User');
const Project = require('../models/Project');

// Get platform analytics (admin only)
router.get('/platform', auth, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLoans = await Loan.countDocuments();
    const totalProjects = await Project.countDocuments();

    const loanStats = await Loan.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$principalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        totalUsers,
        totalLoans,
        totalProjects,
        loanStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
});

// Get user analytics
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const userLoans = await Loan.countDocuments({
      $or: [{ lender: req.userId }, { borrower: req.userId }]
    });

    const activeLoans = await Loan.countDocuments({
      lender: req.userId,
      status: 'active'
    });

    res.json({
      success: true,
      analytics: {
        totalLoansGiven: user.totalLoansGiven,
        totalMoneyLent: user.totalMoneyLent,
        activeLoans,
        totalInterestEarned: user.totalInterestEarned,
        creditScore: user.creditScore
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user analytics',
      error: error.message
    });
  }
});

module.exports = router;
