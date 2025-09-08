const mongoose = require('mongoose');

const userSummarySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  overallSummary: String,
  recentContext: String,
  keyPatterns: [{
    pattern: String,
    frequency: { type: Number, default: 1 },
    lastMentioned: Date,
    importance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  importantNotes: [{
    note: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    addedAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false }
  }],
  progressMetrics: {
    totalSessions: { type: Number, default: 0 },
    averageMoodScore: Number,
    moodTrend: {
      type: String,
      enum: ['improving', 'stable', 'declining']
    },
    engagementLevel: Number
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserSummary', userSummarySchema);
