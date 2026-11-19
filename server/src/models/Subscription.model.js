const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'expired', 'cancelled', 'suspended'],
      default: 'active',
      index: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: true,
      index: true
    },
    jobPostingLimit: {
      type: Number,
      required: true,
      min: 1
    },
    usedJobPostings: {
      type: Number,
      default: 0
    },
    activeJobCount: {
      type: Number,
      default: 0
    },
    autoRenew: {
      type: Boolean,
      default: false
    },
    features: {
      featuredListing: { type: Boolean, default: false },
      analyticsEnabled: { type: Boolean, default: false },
      multipleRecruiters: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true
  }
);

// Method to determine if subscription is currently valid for posting
subscriptionSchema.methods.isValid = function () {
  const isStatusActive = this.status === 'active';
  const isNotExpired = new Date() <= new Date(this.endDate);
  const hasRemainingLimit = this.usedJobPostings < this.jobPostingLimit;
  return isStatusActive && isNotExpired && hasRemainingLimit;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
