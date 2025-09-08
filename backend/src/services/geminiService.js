const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateResponse(userMessage, userContext = '') {
    try {
      const prompt = this.buildPrompt(userMessage, userContext);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return {
        message: response.text(),
        metadata: this.extractMetadata(userMessage, response.text())
      };
    } catch (error) {
      logger.error('Gemini API error:', error);
      return {
        message: "I'm here to listen and support you. Could you tell me more about how you're feeling?",
        metadata: { error: true }
      };
    }
  }

  buildPrompt(userMessage, userContext) {
    return `You are a compassionate mental health support chatbot. 

User Context: ${userContext}

Current Message: "${userMessage}"

Respond with empathy, validation, and helpful guidance. Keep responses supportive and non-judgmental. If you detect crisis language, gently suggest professional help while being supportive.

Guidelines:
- Be warm and understanding
- Ask follow-up questions to encourage sharing
- Provide coping strategies when appropriate
- Never diagnose or provide medical advice
- If crisis indicators are present, prioritize safety

Response:`;
  }

  extractMetadata(userMessage, botResponse) {
    // Simple metadata extraction
    const moodIndicators = {
      'happy': 8, 'good': 7, 'okay': 5, 'sad': 3, 'depressed': 2,
      'anxious': 3, 'worried': 4, 'stressed': 3, 'angry': 4, 'frustrated': 4
    };

    let moodScore = 5; // Default neutral
    const emotions = [];

    Object.keys(moodIndicators).forEach(emotion => {
      if (userMessage.toLowerCase().includes(emotion)) {
        moodScore = moodIndicators[emotion];
        emotions.push(emotion);
      }
    });

    return {
      moodScore,
      emotionTags: emotions,
      confidence: 0.7 // Placeholder confidence score
    };
  }

  async generateSummary(messages) {
    try {
      const conversation = messages.map(msg => 
        `${msg.sender}: ${msg.message}`
      ).join('\n');

      const prompt = `Summarize this mental health conversation focusing on:
1. Main topics discussed
2. User's emotional state
3. Key concerns or issues
4. Progress or insights gained

Conversation:
${conversation}

Provide a concise summary (2-3 sentences):`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      logger.error('Summary generation error:', error);
      return "Conversation covered user's current emotional state and concerns.";
    }
  }
}

module.exports = new GeminiService();
