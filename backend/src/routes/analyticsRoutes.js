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

    const activeLoans = await Loan.countDocuments({
      lender: req.userId,
      status: 'active'
    });

    const loans = await Loan.find({ lender: req.userId }).populate('project');
    
    let totalMoneyLent = 0;
    let totalInterestEarned = 0;
    const categoryDataMap = {};
    const monthlyDataMap = {};

    loans.forEach(loan => {
      totalMoneyLent += loan.principalAmount || 0;
      totalInterestEarned += loan.cashFlow?.totalInterestPaid || 0;
      
      if (loan.project && loan.project.category) {
        categoryDataMap[loan.project.category] = (categoryDataMap[loan.project.category] || 0) + (loan.principalAmount || 0);
      }
      
      const d = new Date(loan.startDate || loan.createdAt);
      const month = d.toLocaleString('en-US', { month: 'short' });
      if (!monthlyDataMap[month]) monthlyDataMap[month] = { lent: 0, earned: 0 };
      monthlyDataMap[month].lent += loan.principalAmount || 0;
      monthlyDataMap[month].earned += loan.cashFlow?.totalInterestPaid || 0;
    });

    const categoryData = Object.keys(categoryDataMap).map(name => ({
      name,
      value: categoryDataMap[name]
    }));

    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const m = d.toLocaleString('en-US', { month: 'short' });
      monthlyData.push({
        month: m,
        lent: monthlyDataMap[m]?.lent || 0,
        earned: monthlyDataMap[m]?.earned || 0
      });
    }

    res.json({
      success: true,
      analytics: {
        totalLoansGiven: loans.length,
        totalMoneyLent,
        activeLoans,
        totalInterestEarned,
        creditScore: user.creditScore || 700,
        monthlyData,
        categoryData
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
