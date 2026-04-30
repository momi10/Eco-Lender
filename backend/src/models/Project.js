const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Project description is required']
    },
    category: {
      type: String,
      enum: [
        'Solar Power',
        'Urban Farming',
        'Water Conservation',
        'Renewable Energy',
        'Waste Management',
        'Education',
        'Healthcare',
        'Community Development'
      ],
      required: true
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target funding amount is required'],
      min: [100, 'Target amount must be at least $100']
    },
    fundedAmount: {
      type: Number,
      default: 0
    },
    interestRate: {
      type: Number,
      default: 5,
      min: [0, 'Interest rate cannot be negative'],
      max: [30, 'Interest rate cannot exceed 30%']
    },
    duration: {
      type: Number,
      required: true,
      description: 'Duration in months'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      street: String,
      city: String,
      state: String,
      country: String,
      latitude: Number,
      longitude: Number
    },
    images: [String],
    documents: [String],
    status: {
      type: String,
      enum: ['draft', 'active', 'funded', 'completed', 'failed'],
      default: 'draft'
    },
    lenders: [{
      lenderId: mongoose.Schema.Types.ObjectId,
      amount: Number,
      date: Date
    }],
    impact: {
      expectedBeneficiaries: Number,
      carbonReductionEstimate: Number,
      environmentalMetrics: String
    },
    milestones: [{
      title: String,
      description: String,
      targetDate: Date,
      completed: Boolean,
      completionDate: Date
    }],
    updates: [{
      title: String,
      content: String,
      images: [String],
      date: Date
    }],
    verification: {
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      verifiedBy: mongoose.Schema.Types.ObjectId,
      verificationDate: Date,
      notes: String
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);

// Index for faster queries
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ 'location.city': 1 });
projectSchema.index({ owner: 1 });

module.exports = mongoose.model('Project', projectSchema);
