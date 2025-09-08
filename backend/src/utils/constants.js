const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die',
  'self harm', 'hurt myself', 'cut myself', 'overdose',
  'hopeless', 'nothing matters', 'better off dead'
];

const MOOD_LEVELS = {
  VERY_LOW: 1,
  LOW: 2,
  MILD_LOW: 3,
  NEUTRAL_LOW: 4,
  NEUTRAL: 5,
  NEUTRAL_HIGH: 6,
  MILD_HIGH: 7,
  HIGH: 8,
  VERY_HIGH: 9,
  EXCELLENT: 10
};

const CRISIS_SEVERITY = {
  NONE: 'none',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

module.exports = {
  CRISIS_KEYWORDS,
  MOOD_LEVELS,
  CRISIS_SEVERITY
};

