export const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const detectCrisisKeywords = (message) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'hurt myself', 'self harm',
    'die', 'hopeless', 'worthless', 'nobody cares', 'better off dead'
  ];
  
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
};

export const getMoodColor = (moodScore) => {
  if (moodScore >= 7) return '#10B981'; // green
  if (moodScore >= 5) return '#F59E0B'; // yellow
  if (moodScore >= 3) return '#EF4444'; // red
  return '#6B7280'; // gray
};

export const getMoodLabel = (moodScore) => {
  if (moodScore >= 8) return 'Excellent';
  if (moodScore >= 6) return 'Good';
  if (moodScore >= 4) return 'Fair';
  if (moodScore >= 2) return 'Poor';
  return 'Very Poor';
};

export const getTrendIcon = (trend) => {
  switch (trend) {
    case 'improving':
      return '📈';
    case 'declining':
      return '📉';
    default:
      return '➡️';
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};