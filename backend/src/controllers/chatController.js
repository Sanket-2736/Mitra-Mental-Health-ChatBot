const { randomUUID } = require('crypto');
const ChatSession = require('../models/ChatSession');
const UserSummary = require('../models/UserSummary');
const geminiService = require('../services/geminiService');
const crisisService = require('../services/crisisService');
const logger = require('../utils/logger');

const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.userId;

    // Get user context for personalized responses
    const userSummary = await UserSummary.findOne({ userId });
    const userContext = userSummary ? userSummary.recentContext : '';

    // Crisis detection
    const crisisDetection = crisisService.detectCrisisLevel(message);

    let botResponse;
    if (crisisDetection.level !== 'none') {
      // Log crisis event
      await crisisService.logCrisisEvent(
        userId,
        crisisDetection.level,
        crisisDetection.keywords,
        { triggerMessage: message }
      );

      const crisisResponse = crisisService.getCrisisResponse(crisisDetection.level);
      botResponse = {
        message: crisisResponse.message,
        metadata: {
          crisis: true,
          severity: crisisDetection.level,
          resources: crisisResponse.resources
        }
      };
    } else {
      // Generate normal response using Gemini
      botResponse = await geminiService.generateResponse(message, userContext);
    }

    // Find or create chat session
    let chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      chatSession = new ChatSession({
        sessionId: sessionId || randomUUID(),
        userId,
        messages: []
      });
    }

    // Add messages to session
    chatSession.messages.push(
      {
        messageId: randomUUID(),
        sender: 'user',
        message,
        timestamp: new Date(),
        metadata: {
          moodScore: botResponse.metadata?.moodScore,
          emotionTags: botResponse.metadata?.emotionTags
        }
      },
      {
        messageId: randomUUID(),
        sender: 'bot',
        message: botResponse.message,
        timestamp: new Date()
      }
    );

    // 🔧 FIX 1: Calculate and store session-level moodScore
    const userMessages = chatSession.messages.filter(msg => msg.sender === 'user');
    const moodScores = userMessages
      .map(msg => msg.metadata?.moodScore)
      .filter(score => score != null);
    
    if (moodScores.length > 0) {
      chatSession.moodScore = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
    }

    chatSession.sessionMetadata = {
      messageCount: chatSession.messages.length,
      crisisLevel: crisisDetection.level,
      interventionTriggered: crisisDetection.level !== 'none'
    };

    chatSession.updatedAt = new Date();
    await chatSession.save();

    // 🔧 FIX 2: Update user summary immediately after each message
    await updateUserSummaryRealtime(userId, botResponse.metadata);

    res.json({
      success: true,
      message: botResponse.message,
      sessionId: chatSession.sessionId,
      metadata: botResponse.metadata
    });

  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 10, page = 1 } = req.query;

    const sessions = await ChatSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('sessionId messages.sender messages.message messages.timestamp createdAt');

    res.json({ success: true, sessions });
  } catch (error) {
    logger.error('Get chat history error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.userId;

    const chatSession = await ChatSession.findOne({ sessionId, userId });
    if (!chatSession) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // 🔧 FIX 3: Ensure user summary exists before trying to update it
    let userSummary = await UserSummary.findOne({ userId });
    if (!userSummary) {
      userSummary = await createInitialUserSummary(userId);
    }

    // Generate session summary
    const summary = await geminiService.generateSummary(chatSession.messages);
    chatSession.summary = summary;

    // Extract key topics
    const messageText = chatSession.messages
      .filter(msg => msg.sender === 'user')
      .map(msg => msg.message)
      .join(' ');

    const keyTopics = extractKeyTopics(messageText);
    chatSession.keyTopics = keyTopics;

    await chatSession.save();

    // Update user summary with session data
    await updateUserSummaryWithSession(userId, summary, keyTopics, chatSession);

    res.json({ success: true, message: 'Session ended successfully', summary });

  } catch (error) {
    logger.error('End session error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 🔧 NEW HELPER FUNCTIONS

// Create initial user summary if it doesn't exist
const createInitialUserSummary = async (userId) => {
  const userSummary = new UserSummary({
    userId,
    overallSummary: 'New user - first interaction',
    recentContext: 'User just started using Mitra',
    keyPatterns: [],
    importantNotes: [],
    progressMetrics: {
      totalSessions: 0,
      averageMoodScore: null,
      moodTrend: 'stable',
      engagementLevel: 0
    }
  });
  await userSummary.save();
  return userSummary;
};

// Update user summary in real-time (after each message)
const updateUserSummaryRealtime = async (userId, metadata) => {
  try {
    let userSummary = await UserSummary.findOne({ userId });
    if (!userSummary) {
      userSummary = await createInitialUserSummary(userId);
    }

    // Update mood trend if we have mood data
    if (metadata?.moodScore) {
      const recentSessions = await ChatSession.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      const allMoodScores = [];
      recentSessions.forEach(session => {
        session.messages.forEach(msg => {
          if (msg.metadata?.moodScore) {
            allMoodScores.push(msg.metadata.moodScore);
          }
        });
      });

      if (allMoodScores.length > 0) {
        userSummary.progressMetrics.averageMoodScore = 
          allMoodScores.reduce((a, b) => a + b, 0) / allMoodScores.length;
        userSummary.progressMetrics.moodTrend = calculateMoodTrend(allMoodScores);
      }
    }

    userSummary.lastUpdated = new Date();
    await userSummary.save();
  } catch (error) {
    logger.error('Error updating user summary realtime:', error);
  }
};

// Update user summary with complete session data
const updateUserSummaryWithSession = async (userId, summary, keyTopics, chatSession) => {
  try {
    const userSummary = await UserSummary.findOne({ userId });

    // Update recent context (last 3 summaries)
    const recentSummaries = userSummary.recentContext ? 
      userSummary.recentContext.split('|').slice(-2) : [];
    recentSummaries.push(summary);
    userSummary.recentContext = recentSummaries.join('|');

    // Update key patterns
    keyTopics.forEach(topic => {
      const existingPattern = userSummary.keyPatterns.find(p => p.pattern.includes(topic));
      if (existingPattern) {
        existingPattern.frequency += 1;
        existingPattern.lastMentioned = new Date();
      } else {
        userSummary.keyPatterns.push({
          pattern: `User frequently discusses ${topic}`,
          frequency: 1,
          lastMentioned: new Date()
        });
      }
    });

    // Update session count
    userSummary.progressMetrics.totalSessions += 1;

    // Calculate comprehensive mood metrics
    const allSessions = await ChatSession.find({ userId });
    const allMoodScores = [];
    allSessions.forEach(session => {
      if (session.moodScore) allMoodScores.push(session.moodScore);
    });

    if (allMoodScores.length > 0) {
      userSummary.progressMetrics.averageMoodScore = 
        allMoodScores.reduce((a, b) => a + b, 0) / allMoodScores.length;
      userSummary.progressMetrics.moodTrend = calculateMoodTrend(allMoodScores);
    }

    userSummary.lastUpdated = new Date();
    await userSummary.save();
  } catch (error) {
    logger.error('Error updating user summary with session:', error);
  }
};

// Helper function to extract key topics
const extractKeyTopics = (text) => {
  const commonTopics = [
    'anxiety', 'stress', 'depression', 'work', 'relationships', 
    'family', 'health', 'sleep', 'anger', 'sadness', 'fear', 
    'loneliness', 'worry', 'panic', 'tired', 'overwhelmed'
  ];
  
  const lowerText = text.toLowerCase();
  return commonTopics.filter(topic => lowerText.includes(topic));
};

// Helper function to calculate mood trend
const calculateMoodTrend = (moodScores) => {
  if (moodScores.length < 3) return 'stable';
  
  // Compare recent vs older scores
  const recentCount = Math.min(3, Math.ceil(moodScores.length / 3));
  const recent = moodScores.slice(0, recentCount);
  const older = moodScores.slice(recentCount, recentCount * 2);
  
  if (older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const difference = recentAvg - olderAvg;
  
  if (difference > 1) return 'improving';
  if (difference < -1) return 'declining';
  return 'stable';
};

module.exports = { sendMessage, getChatHistory, endSession };