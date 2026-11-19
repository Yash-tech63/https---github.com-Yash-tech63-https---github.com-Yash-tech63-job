const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    otp: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      enum: ['login', 'register', 'verification'],
      default: 'login'
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 } // MongoDB TTL index to auto-expire documents
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Otp', otpSchema);
