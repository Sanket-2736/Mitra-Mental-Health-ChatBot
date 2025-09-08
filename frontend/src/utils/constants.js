export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  CHAT: {
    MESSAGE: '/chat/message',
    HISTORY: '/chat/history',
    END_SESSION: '/chat/end-session'
  },
  USER: {
    PROFILE: '/user/profile',
    DASHBOARD: '/user/dashboard',
    DELETE_ACCOUNT: '/user/account'
  },
  CRISIS: {
    RESOURCES: '/crisis/resources',
    REPORT: '/crisis/report'
  }
};

export const CRISIS_LEVELS = {
  NONE: 'none',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const CONVERSATION_STYLES = {
  SUPPORTIVE: 'supportive',
  CASUAL: 'casual',
  FORMAL: 'formal'
};

export const NOTIFICATION_FREQUENCY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const MOOD_TRENDS = {
  IMPROVING: 'improving',
  STABLE: 'stable',
  DECLINING: 'declining'
};

export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot'
};

export const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'hurt myself',
  'self harm',
  'die',
  'hopeless',
  'worthless',
  'nobody cares',
  'better off dead'
];

export const EMERGENCY_CONTACTS = {
  US: [
    { name: 'National Suicide Prevention Lifeline', phone: '988', available: '24/7' },
    { name: 'Crisis Text Line', text: 'HOME to 741741', available: '24/7' },
    { name: 'Emergency Services', phone: '911', available: '24/7' }
  ],
  IN: [
    { name: 'Vandrevala Foundation', phone: '+91 9999 666 555', available: '24/7' },
    { name: 'iCALL', phone: '+91 9152 987 821', available: '24/7' },
    { name: 'Emergency Services', phone: '112', available: '24/7' }
  ]
};