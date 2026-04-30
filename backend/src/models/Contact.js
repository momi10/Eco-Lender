const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['support', 'feedback', 'partnership', 'other'],
      default: 'other'
    },
    status: {
      type: String,
      enum: ['new', 'read', 'resolved'],
      default: 'new'
    },
    response: String,
    respondedBy: mongoose.Schema.Types.ObjectId,
    respondedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
