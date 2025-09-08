const mongoose = require('mongoose');

const crisisEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  detectedKeywords: [String],
  conversationContext: {
    triggerMessage: String,
    messagesBefore: [String],
    messagesAfter: [String]
  },
  interventions: [{
    type: {
      type: String,
      enum: ['resource_provided', 'professional_contacted', 'emergency_services']
    },
    action: String,
    timestamp: { type: Date, default: Date.now },
    success: Boolean
  }],
  followUpRequired: { type: Boolean, default: true },
  followUpCompleted: { type: Boolean, default: false },
  professionalNotified: { type: Boolean, default: false },
  resolved: { type: Boolean, default: false },
  resolvedAt: Date,
  timestamp: { type: Date, default: Date.now }
});

crisisEventSchema.index({ userId: 1, timestamp: -1 });
crisisEventSchema.index({ severity: 1, resolved: 1 });

module.exports = mongoose.model('CrisisEvent', crisisEventSchema);
