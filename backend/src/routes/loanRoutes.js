const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Loan = require('../models/Loan');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// Get all loans for user
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {
      $or: [{ lender: req.userId }, { borrower: req.userId }]
    };

    if (status) filter.status = status;

    const loans = await Loan.find(filter)
      .populate('lender', 'firstName lastName email')
      .populate('borrower', 'firstName lastName email')
      .populate('project', 'title category')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Loan.countDocuments(filter);

    res.json({
      success: true,
      loans,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loans',
      error: error.message
    });
  }
});

// Get loan by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('lender')
      .populate('borrower')
      .populate('project');

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    res.json({
      success: true,
      loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan',
      error: error.message
    });
  }
});

// Create loan
router.post('/', auth, async (req, res) => {
  try {
    const { borrowerId, projectId, principalAmount, interestRate, duration } = req.body;

    const loan = new Loan({
      loanId: `LOAN-${uuidv4().substring(0, 8).toUpperCase()}`,
      lender: req.userId,
      borrower: borrowerId,
      project: projectId,
      principalAmount,
      interestRate,
      duration,
      totalAmount: principalAmount * (1 + (interestRate / 100)),
      cashFlow: {
        totalRepaid: 0,
        totalInterestPaid: 0,
        outstandingBalance: principalAmount
      }
    });

    await loan.save();
    await loan.populate(['lender', 'borrower', 'project']);

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating loan',
      error: error.message
    });
  }
});

// Record payment
router.post('/:id/payment', auth, async (req, res) => {
  try {
    const { amount, type } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    loan.payments.push({
      date: new Date(),
      amount,
      type,
      transactionId: `TXN-${uuidv4().substring(0, 8).toUpperCase()}`,
      status: 'completed'
    });

    loan.cashFlow.totalRepaid += amount;
    loan.cashFlow.outstandingBalance -= amount;

    await loan.save();

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
});

module.exports = router;
