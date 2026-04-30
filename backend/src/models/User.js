const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      latitude: Number,
      longitude: Number
    },
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String
    },
    userType: {
      type: String,
      enum: ['lender', 'borrower', 'admin'],
      default: 'lender'
    },
    preferences: {
      category: {
        type: [String],
        default: ['Solar Power', 'Urban Farming', 'Water Conservation']
      },
      riskTolerance: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true }
      }
    },
    creditScore: {
      type: Number,
      default: 0
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    kycDocuments: [{
      type: String,
      url: String,
      uploadedAt: Date
    }],
    totalLoansGiven: {
      type: Number,
      default: 0
    },
    totalMoneyLent: {
      type: Number,
      default: 0
    },
    activeLoans: {
      type: Number,
      default: 0
    },
    totalInterestEarned: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Hide sensitive fields
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.kycDocuments;
  return user;
};

module.exports = mongoose.model('User', userSchema);
