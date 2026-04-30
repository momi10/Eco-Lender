const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
  {
    loanId: {
      type: String,
      unique: true,
      required: true
    },
    lender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    principalAmount: {
      type: Number,
      required: true,
      min: [10, 'Minimum loan amount is $10']
    },
    interestRate: {
      type: Number,
      required: true,
      min: 0,
      max: 30
    },
    duration: {
      type: Number,
      required: true,
      description: 'Duration in months'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    maturityDate: {
      type: Date,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'defaulted', 'closed', 'cancelled'],
      default: 'pending'
    },
    repaymentSchedule: [{
      installmentNumber: Number,
      dueDate: Date,
      amount: Number,
      paid: Boolean,
      paidDate: Date,
      paidAmount: Number
    }],
    cashFlow: {
      totalRepaid: {
        type: Number,
        default: 0
      },
      totalInterestPaid: {
        type: Number,
        default: 0
      },
      outstandingBalance: {
        type: Number,
        required: true
      },
      nextPaymentDue: Date
    },
    payments: [{
      date: Date,
      amount: Number,
      type: {
        type: String,
        enum: ['principal', 'interest', 'both'],
        default: 'both'
      },
      transactionId: String,
      status: String
    }],
    terms: {
      earlyRepaymentAllowed: Boolean,
      penaltyPercentage: Number,
      gracePeriodDays: Number
    },
    documents: {
      loanAgreement: String,
      certificate: String,
      impactReport: String
    },
    riskAssessment: {
      score: Number,
      level: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      factors: [String]
    },
    collateral: {
      description: String,
      value: Number
    }
  },
  { timestamps: true }
);

// Calculate maturity date before saving
loanSchema.pre('save', function (next) {
  if (!this.maturityDate) {
    const start = this.startDate || new Date();
    const maturity = new Date(start);
    maturity.setMonth(maturity.getMonth() + this.duration);
    this.maturityDate = maturity;
  }

  if (!this.totalAmount) {
    this.totalAmount = this.principalAmount * (1 + (this.interestRate / 100));
  }

  if (!this.cashFlow) {
    this.cashFlow = {
      totalRepaid: 0,
      totalInterestPaid: 0,
      outstandingBalance: this.principalAmount,
      nextPaymentDue: this.maturityDate
    };
  }

  next();
});

// Index for faster queries
loanSchema.index({ lender: 1, status: 1 });
loanSchema.index({ borrower: 1, status: 1 });
loanSchema.index({ project: 1 });

module.exports = mongoose.model('Loan', loanSchema);
