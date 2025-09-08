const { CRISIS_KEYWORDS, CRISIS_SEVERITY } = require('../utils/constants');
const CrisisEvent = require('../models/CrisisEvent');
const logger = require('../utils/logger');
const { randomUUID } = require('crypto');

class CrisisService {
  detectCrisisLevel(message) {
    const lowerMessage = message.toLowerCase();
    const detectedKeywords = CRISIS_KEYWORDS.filter(keyword => 
      lowerMessage.includes(keyword)
    );

    if (detectedKeywords.length === 0) return { level: CRISIS_SEVERITY.NONE, keywords: [] };
    
    // Simple scoring based on keyword severity
    const highRiskKeywords = ['suicide', 'kill myself', 'end my life', 'want to die'];
    const hasHighRisk = detectedKeywords.some(keyword => highRiskKeywords.includes(keyword));
    
    if (hasHighRisk) {
      return { level: CRISIS_SEVERITY.HIGH, keywords: detectedKeywords };
    }
    
    if (detectedKeywords.length >= 2) {
      return { level: CRISIS_SEVERITY.MEDIUM, keywords: detectedKeywords };
    }
    
    return { level: CRISIS_SEVERITY.LOW, keywords: detectedKeywords };
  }

  async logCrisisEvent(userId, severity, keywords, conversationContext) {
    try {
      const crisisEvent = new CrisisEvent({
        eventId: randomUUID(), // Changed from uuidv4() to randomUUID()
        userId,
        severity,
        detectedKeywords: keywords,
        conversationContext,
        timestamp: new Date()
      });

      await crisisEvent.save();
      logger.warn(`Crisis event logged for user ${userId} - Severity: ${severity}`);
      
      return crisisEvent;
    } catch (error) {
      logger.error('Error logging crisis event:', error);
      throw error;
    }
  }

  getCrisisResponse(severity) {
    const responses = {
      [CRISIS_SEVERITY.LOW]: {
        message: "I notice you might be going through a difficult time. Remember that you're not alone, and there are people who want to help. Would you like to talk about what's troubling you?",
        resources: ["National Suicide Prevention Lifeline: 988"]
      },
      [CRISIS_SEVERITY.MEDIUM]: {
        message: "I'm concerned about what you've shared. Your feelings are valid, but I want to make sure you're safe. Please consider reaching out to a mental health professional or crisis hotline. Would you like me to provide some resources?",
        resources: ["National Suicide Prevention Lifeline: 988", "Crisis Text Line: Text HOME to 741741"]
      },
      [CRISIS_SEVERITY.HIGH]: {
        message: "I'm very concerned about you and want to help. Please know that you matter and there are people who care. It's important to talk to someone right now - a counselor, trusted friend, or crisis hotline. If you're in immediate danger, please call emergency services.",
        resources: ["Emergency Services: 911", "National Suicide Prevention Lifeline: 988", "Crisis Text Line: Text HOME to 741741"]
      }
    };

    return responses[severity] || responses[CRISIS_SEVERITY.LOW];
  }
}

module.exports = new CrisisService();