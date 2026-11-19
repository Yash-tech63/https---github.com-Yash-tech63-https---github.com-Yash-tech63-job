const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    razorpayPaymentId: {
      type: String,
      default: null,
      index: true
    },
    razorpaySignature: {
      type: String,
      default: null
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
      index: true
    },
    paymentMethod: {
      type: String,
      default: null
    },
    signatureVerified: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date,
      default: null
    },
    refundDetails: [
      {
        refundId: String,
        amount: Number,
        status: String,
        initiatedAt: { type: Date, default: Date.now },
        reason: String
      }
    ],
    errorReason: {
      type: String,
      default: null
    },
    webhookEvents: [
      {
        eventId: String,
        event: String,
        receivedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
