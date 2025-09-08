
const User = require('../models/User');
const UserSummary = require('../models/UserSummary');
const ChatSession = require('../models/ChatSession');
const logger = require('../utils/logger');

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ userId }).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.password;
    delete updates.email;
    delete updates.userId;

    const user = await User.findOneAndUpdate(
      { userId },
      { 
        ...updates,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    logger.info(`Getting dashboard for user: ${userId}`);

    // 🔧 FIX 4: Ensure user summary exists
    let userSummary = await UserSummary.findOne({ userId });
    if (!userSummary) {
      userSummary = new UserSummary({
        userId,
        overallSummary: 'New user - no data yet',
        recentContext: 'User just joined Mitra',
        keyPatterns: [],
        progressMetrics: {
          totalSessions: 0,
          averageMoodScore: null,
          moodTrend: 'stable',
          engagementLevel: 0
        }
      });
      await userSummary.save();
    }
    
    // Get recent sessions with better data
    const recentSessions = await ChatSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('sessionId summary keyTopics moodScore createdAt messages');

    logger.info(`Found ${recentSessions.length} recent sessions`);

    // 🔧 FIX 5: Calculate mood data from individual messages, not just session moodScore
    const allMoodData = [];
    const moodHistory = [];
    
    recentSessions.forEach(session => {
      // Check individual messages for mood data
      session.messages?.forEach(msg => {
        if (msg.metadata?.moodScore && msg.sender === 'user') {
          allMoodData.push({
            score: msg.metadata.moodScore,
            date: msg.timestamp,
            emotions: msg.metadata.emotionTags || []
          });
        }
      });
      
      // Also check session-level mood score
      if (session.moodScore) {
        allMoodData.push({
          score: session.moodScore,
          date: session.createdAt,
          emotions: []
        });
      }
    });

    // Create mood history for chart (last 7 days)
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        mood: null
      };
    }).reverse();

    // Fill in actual mood data
    allMoodData.forEach(mood => {
      const moodDate = new Date(mood.date).toISOString().split('T')[0];
      const dayEntry = last7Days.find(day => day.date === moodDate);
      if (dayEntry) {
        dayEntry.mood = mood.score;
      }
    });

    // Calculate average mood
    const validMoodScores = allMoodData.map(m => m.score).filter(s => s != null);
    const averageMood = validMoodScores.length > 0 
      ? validMoodScores.reduce((a, b) => a + b, 0) / validMoodScores.length 
      : null;

    // 🔧 FIX 6: Get topics from both keyTopics and message emotions
    const topicFrequency = {};
    
    // Count keyTopics from sessions
    recentSessions.forEach(session => {
      session.keyTopics?.forEach(topic => {
        topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
      });
    });

    // Count emotions from messages
    allMoodData.forEach(mood => {
      mood.emotions?.forEach(emotion => {
        topicFrequency[emotion] = (topicFrequency[emotion] || 0) + 1;
      });
    });

    const topTopics = Object.entries(topicFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    // Calculate actual session count
    const totalSessions = recentSessions.length;

    // Update user summary with fresh data
    if (averageMood !== null) {
      userSummary.progressMetrics.averageMoodScore = averageMood;
      userSummary.progressMetrics.moodTrend = calculateMoodTrendFromData(validMoodScores);
    }
    userSummary.progressMetrics.totalSessions = totalSessions;
    await userSummary.save();

    const response = {
      success: true,
      summary: userSummary,
      recentSessions: recentSessions.map(session => ({
        sessionId: session.sessionId,
        summary: session.summary || 'Chat session with Mitra',
        createdAt: session.createdAt,
        keyTopics: session.keyTopics || [],
        moodScore: session.moodScore
      })),
      moodHistory: last7Days,
      analytics: {
        averageMood: averageMood ? parseFloat(averageMood.toFixed(1)) : null,
        totalSessions,
        topTopics,
        moodTrend: userSummary.progressMetrics.moodTrend || 'stable'
      }
    };

    logger.info(`Dashboard response: ${JSON.stringify({
      totalSessions,
      averageMood,
      topTopicsCount: topTopics.length,
      moodDataPoints: validMoodScores.length
    })}`);

    res.json(response);
  } catch (error) {
    logger.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Promise.all([
      User.findOneAndDelete({ userId }),
      UserSummary.findOneAndDelete({ userId }),
      ChatSession.deleteMany({ userId })
    ]);

    logger.info(`User account deleted: ${userId}`);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Helper function for mood trend calculation
const calculateMoodTrendFromData = (moodScores) => {
  if (moodScores.length < 3) return 'stable';
  
  // Compare recent 1/3 vs middle 1/3 of data
  const third = Math.floor(moodScores.length / 3);
  const recent = moodScores.slice(0, third);
  const middle = moodScores.slice(third, third * 2);
  
  if (recent.length === 0 || middle.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const middleAvg = middle.reduce((a, b) => a + b, 0) / middle.length;
  
  const difference = recentAvg - middleAvg;
  
  if (difference > 0.8) return 'improving';
  if (difference < -0.8) return 'declining';
  return 'stable';
};

module.exports = { getProfile, updateProfile, getDashboard, deleteAccount };
