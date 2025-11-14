// Common constants across all services

export const SERVICE_PORTS = {
  GATEWAY: 3000,
  AUTH: 3001,
  QUIZ: 3002,
  LEADERBOARD: 3003,
  FEEDBACK: 3004,
  NOTIFICATION: 3005,
  FRONTEND: 3006,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const XP_REWARDS = {
  QUIZ_COMPLETION: 100,
  PERFECT_SCORE: 50,
  FIRST_ATTEMPT: 25,
  DAILY_LOGIN: 10,
  STREAK_BONUS: 5,
  CHALLENGE_WIN: 150,
  BADGE_EARNED: 200,
} as const;

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000, 20000, 26000, 33000, 41000, 50000
];

export const QUIZ_CATEGORIES = [
  'Mathematics',
  'Science',
  'History',
  'Geography',
  'Literature',
  'Programming',
  'General Knowledge',
  'Languages',
  'Arts',
  'Sports',
  'Technology',
  'Business',
] as const;

export const BADGE_DEFINITIONS = {
  FIRST_QUIZ: {
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    rarity: 'common',
  },
  PERFECT_SCORE: {
    name: 'Perfectionist',
    description: 'Achieve 100% on any quiz',
    icon: '💯',
    rarity: 'rare',
  },
  STREAK_7: {
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare',
  },
  STREAK_30: {
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🌟',
    rarity: 'epic',
  },
  TOP_10: {
    name: 'Elite Ten',
    description: 'Reach top 10 on global leaderboard',
    icon: '👑',
    rarity: 'epic',
  },
  QUIZ_MASTER: {
    name: 'Quiz Master',
    description: 'Complete 100 quizzes',
    icon: '🏆',
    rarity: 'legendary',
  },
} as const;

export const RATE_LIMITS = {
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 5,
  },
  API: {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
  },
  QUIZ: {
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
    MAX_REQUESTS: 50,
  },
} as const;

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const;

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to perform this action',
  QUIZ_NOT_FOUND: 'Quiz not found',
  INVALID_TOKEN: 'Invalid or expired token',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
} as const;
