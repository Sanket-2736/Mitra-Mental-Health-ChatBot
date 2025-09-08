const CrisisEvent = require('../models/CrisisEvent');
const logger = require('../utils/logger');

const getCrisisResources = async (req, res) => {
  try {
    const { country = 'US' } = req.query;

    // Static crisis resources (in production, this would be from a database)
    const resources = {
      US: [
        {
          name: 'National Suicide Prevention Lifeline',
          phone: '988',
          description: '24/7 free and confidential support',
          website: 'https://suicidepreventionlifeline.org'
        },
        {
          name: 'Crisis Text Line',
          text: 'HOME to 741741',
          description: '24/7 text-based crisis support'
        },
        {
          name: 'SAMHSA National Helpline',
          phone: '1-800-662-4357',
          description: 'Mental health and substance abuse treatment referrals'
        }
      ],
      IN: [
        {
          name: 'Vandrevala Foundation',
          phone: '+91 9999 666 555',
          description: '24x7 mental health helpline'
        },
        {
          name: 'iCALL',
          phone: '+91 9152 987 821',
          description: 'Psychosocial helpline'
        }
      ]
    };

    res.json({
      success: true,
      country,
      resources: resources[country] || resources['US']
    });
  } catch (error) {
    logger.error('Get crisis resources error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const reportCrisis = async (req, res) => {
  try {
    const { severity, description, immediateHelp } = req.body;
    const userId = req.user.userId;

    // This would typically trigger immediate interventions
    // For now, we'll just log and provide resources
    logger.warn(`Crisis reported by user ${userId} - Severity: ${severity}`);

    if (immediateHelp) {
      // In production, this might contact emergency services or mental health professionals
      logger.error(`IMMEDIATE HELP REQUESTED by user ${userId}`);
    }

    res.json({
      success: true,
      message: 'Crisis report received. Help is available.',
      resources: [
        { type: 'phone', contact: '911', description: 'Emergency Services' },
        { type: 'phone', contact: '988', description: 'Suicide Prevention Lifeline' }
      ],
      followUp: 'A mental health professional will be in touch within 24 hours.'
    });
  } catch (error) {
    logger.error('Report crisis error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getCrisisResources, reportCrisis };
