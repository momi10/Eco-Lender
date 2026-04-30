const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true
    },
    content: {
      type: String,
      required: true
    },
    excerpt: {
      type: String,
      maxlength: 300
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      enum: ['Sustainability', 'Finance', 'Community', 'Technology', 'News'],
      default: 'News'
    },
    tags: [String],
    featured_image: String,
    views: {
      type: Number,
      default: 0
    },
    published: {
      type: Boolean,
      default: false
    },
    publishedAt: Date
  },
  { timestamps: true }
);

// Auto-generate slug
blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
