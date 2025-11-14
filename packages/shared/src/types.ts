// Common types and interfaces shared across all microservices

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// User Types
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  INSTITUTION = 'institution'
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile?: UserProfile;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  institution?: string;
  grade?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Quiz Types
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  FILL_IN_BLANK = 'fill_in_blank'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: DifficultyLevel;
  points: number;
  timeLimit?: number; // in seconds
  tags?: string[];
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  createdBy: string;
  isPublic: boolean;
  timeLimit?: number; // in minutes
  passingScore: number;
  questions: Question[];
  tags: string[];
  attemptsAllowed?: number;
  createdAt: Date;
  updatedAt: Date;
  totalAttempts?: number;
  averageScore?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: QuestionAnswer[];
  score: number;
  percentage: number;
  isPassed: boolean;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
  xpEarned: number;
}

export interface QuestionAnswer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
}

// Leaderboard Types
export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  xp: number;
  level: number;
  rank: number;
  totalQuizzes: number;
  averageScore: number;
  badges: Badge[];
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

export interface XPTransaction {
  userId: string;
  amount: number;
  source: 'quiz_completion' | 'daily_streak' | 'achievement' | 'challenge_win';
  metadata?: Record<string, any>;
  timestamp: Date;
}

// Feedback Types
export interface FeedbackReport {
  id: string;
  userId: string;
  quizId: string;
  attemptId: string;
  overallAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextSteps: string[];
  estimatedImprovementTime: string;
  difficultyAdjustment: DifficultyLevel;
  createdAt: Date;
}

export interface AdaptiveDifficultyData {
  userId: string;
  subject: string;
  currentLevel: DifficultyLevel;
  recentScores: number[];
  consistencyScore: number;
  recommendedLevel: DifficultyLevel;
}

// Notification Types
export enum NotificationType {
  EMAIL = 'email',
  PUSH = 'push',
  IN_APP = 'in_app'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  sentAt: Date;
  readAt?: Date;
}

// Event Types (for event-driven architecture)
export enum EventType {
  USER_REGISTERED = 'user.registered',
  USER_LOGIN = 'user.login',
  QUIZ_CREATED = 'quiz.created',
  QUIZ_COMPLETED = 'quiz.completed',
  QUIZ_FAILED = 'quiz.failed',
  LEVEL_UP = 'user.level_up',
  BADGE_EARNED = 'user.badge_earned',
  LEADERBOARD_UPDATED = 'leaderboard.updated',
  CHALLENGE_CREATED = 'challenge.created',
  CHALLENGE_ACCEPTED = 'challenge.accepted',
  FEEDBACK_GENERATED = 'feedback.generated'
}

export interface Event<T = any> {
  type: EventType;
  payload: T;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Challenge Types (for real-time battles)
export interface Challenge {
  id: string;
  createdBy: string;
  challengedUser?: string;
  quizId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  participants: ChallengeParticipant[];
  winner?: string;
}

export interface ChallengeParticipant {
  userId: string;
  username: string;
  score: number;
  completedAt?: Date;
  isReady: boolean;
}

// Error Types
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, true);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, true);
  }
}
