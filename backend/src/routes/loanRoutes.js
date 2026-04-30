const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Loan = require('../models/Loan');
const User = require('../models/User');
const Project = require('../models/Project');
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

    const start = new Date();
    const maturity = new Date(start);
    maturity.setMonth(maturity.getMonth() + Number(duration));

    const loan = new Loan({
      loanId: `LOAN-${uuidv4().substring(0, 8).toUpperCase()}`,
      lender: req.userId,
      borrower: borrowerId,
      project: projectId,
      principalAmount,
      interestRate,
      duration,
      startDate: start,
      maturityDate: maturity,
      totalAmount: principalAmount * (1 + (interestRate / 100)),
      cashFlow: {
        totalRepaid: 0,
        totalInterestPaid: 0,
        outstandingBalance: principalAmount
      }
    });

    await loan.save();

    // Update Project funded amount and lenders array
    const project = await Project.findById(projectId);
    if (project) {
      project.fundedAmount += Number(principalAmount);
      project.lenders.push({
        lenderId: req.userId,
        amount: Number(principalAmount),
        date: new Date()
      });
      
      if (project.fundedAmount >= project.targetAmount) {
        project.status = 'funded';
      }
      
    await project.save();
    }

    await loan.populate('lender borrower project');

    res.status(201).json({
      success: true,
      message: 'Loan created successfully',
      loan
    });
  } catch (error) {
    console.error('Error creating loan:', error);
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

// Download Loan Agreement PDF
router.get('/:id/agreement', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('lender', 'firstName lastName email')
      .populate('borrower', 'firstName lastName email')
      .populate('project', 'title category');

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=loan-agreement-${loan.loanId}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(22).font('Helvetica-Bold').text('LOAN AGREEMENT', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(12).font('Helvetica').text('Eco-Lender Platform', { align: 'center' });
    doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1);

    // Parties
    doc.fontSize(13).font('Helvetica-Bold').text('PARTIES');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Lender: ${loan.lender?.firstName} ${loan.lender?.lastName} (${loan.lender?.email})`);
    doc.text(`Borrower: ${loan.borrower?.firstName} ${loan.borrower?.lastName} (${loan.borrower?.email})`);
    doc.text(`Project: ${loan.project?.title || 'N/A'}`);
    doc.moveDown(1);

    // Loan Terms
    doc.fontSize(13).font('Helvetica-Bold').text('LOAN TERMS');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Loan ID: ${loan.loanId}`);
    doc.text(`Principal Amount: $${loan.principalAmount?.toFixed(2)}`);
    doc.text(`Interest Rate: ${loan.interestRate}% per annum`);
    doc.text(`Duration: ${loan.duration} months`);
    doc.text(`Total Amount: $${loan.totalAmount?.toFixed(2)}`);
    doc.moveDown(1);

    // Cash Flow
    doc.fontSize(13).font('Helvetica-Bold').text('CASH FLOW STATEMENT');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Total Repaid: $${(loan.cashFlow?.totalRepaid || 0).toFixed(2)}`);
    doc.text(`Outstanding Balance: $${(loan.cashFlow?.outstandingBalance || 0).toFixed(2)}`);
    doc.moveDown(1);

    // Terms
    doc.fontSize(13).font('Helvetica-Bold').text('TERMS AND CONDITIONS');
    doc.fontSize(9).font('Helvetica');
    doc.text('1. The borrower agrees to repay the principal amount with interest as per the agreed schedule.');
    doc.text('2. Payments must be made on or before the due date.');
    doc.text('3. Late payments may incur penalties as per the platform policy.');
    doc.text('4. This agreement is binding on both parties.');
    doc.moveDown(2);

    // Signatures
    doc.fontSize(12).font('Helvetica-Bold').text('SIGNATURES');
    doc.moveDown(1.5);
    doc.fontSize(10).font('Helvetica');
    doc.text('Lender: ________________________          Date: ____________');
    doc.moveDown(1);
    doc.text('Borrower: ________________________       Date: ____________');

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating PDF', error: error.message });
  }
});

// Download Impact Certificate PDF
router.get('/:id/certificate', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('lender', 'firstName lastName')
      .populate('project', 'title category impact');

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({ layout: 'landscape' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=impact-certificate-${loan.loanId}.pdf`);
    doc.pipe(res);

    doc.moveDown(3);
    doc.fontSize(28).font('Helvetica-Bold').text('IMPACT CERTIFICATE', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(14).font('Helvetica').text('Eco-Lender Sustainability Platform', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(14).text('This certifies that', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(20).font('Helvetica-Bold').text(
      `${loan.lender?.firstName} ${loan.lender?.lastName}`,
      { align: 'center' }
    );
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica').text('has made a sustainable investment in', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).font('Helvetica-Bold').text(loan.project?.title || 'Green Initiative', { align: 'center' });
    doc.moveDown(1);

    doc.fontSize(12).font('Helvetica');
    doc.text(`Investment Amount: $${loan.principalAmount?.toFixed(2)}`, { align: 'center' });
    doc.text(`Category: ${loan.project?.category || 'Sustainability'}`, { align: 'center' });
    doc.text(`Beneficiaries: ${loan.project?.impact?.expectedBeneficiaries || 0}+ people`, { align: 'center' });
    doc.text(`CO₂ Reduction: ${loan.project?.impact?.carbonReductionEstimate || 0} tons`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(10).text(
      'This certificate is issued in recognition of your commitment to sustainable development and environmental impact.',
      { align: 'center' }
    );

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating certificate', error: error.message });
  }
});

module.exports = router;
