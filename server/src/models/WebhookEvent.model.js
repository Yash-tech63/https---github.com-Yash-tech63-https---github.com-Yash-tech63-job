const mongoose = require('mongoose');

const webhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    event: {
      type: String,
      required: true
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    processed: {
      type: Boolean,
      default: false
    },
    processedAt: {
      type: Date,
      default: null
    },
    error: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WebhookEvent', webhookEventSchema);
