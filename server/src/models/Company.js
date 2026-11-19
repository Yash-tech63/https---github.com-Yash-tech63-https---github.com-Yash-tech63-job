const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    industry: {
      type: String,
      trim: true,
      default: 'Technology'
    },
    size: {
      type: String,
      trim: true,
      default: '1-10 employees'
    },
    location: {
      type: String,
      trim: true,
      default: 'San Francisco, CA'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    logoUrl: {
      type: String,
      default: ''
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'valid', 'invalid'],
      default: 'pending'
    },
    adminNote: {
      type: String,
      default: ''
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Company', companySchema);
