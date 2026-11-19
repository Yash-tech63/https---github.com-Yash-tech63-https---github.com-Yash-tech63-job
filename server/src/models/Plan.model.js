const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Plan slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative']
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true
    },
    billingType: {
      type: String,
      enum: ['per_job', 'monthly', 'yearly'],
      default: 'monthly'
    },
    durationDays: {
      type: Number,
      default: 30,
      min: [1, 'Duration must be at least 1 day']
    },
    jobPostingLimit: {
      type: Number,
      required: [true, 'Job posting limit is required'],
      min: [1, 'Limit must be at least 1']
    },
    featuredListing: {
      type: Boolean,
      default: false
    },
    analyticsEnabled: {
      type: Boolean,
      default: false
    },
    multipleRecruiters: {
      type: Boolean,
      default: false
    },
    features: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Plan', planSchema);
