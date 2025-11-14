/**
 * Firebase Analytics Helper Functions
 * Track user events and behaviors
 */

import { logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { getFirebaseAnalytics } from "./firebase";

/**
 * Log a custom event to Firebase Analytics
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  const analytics = getFirebaseAnalytics();
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

/**
 * Set user ID for analytics
 */
export const setAnalyticsUserId = (userId: string) => {
  const analytics = getFirebaseAnalytics();
  if (analytics) {
    setUserId(analytics, userId);
  }
};

/**
 * Set user properties for analytics
 */
export const setAnalyticsUserProperties = (properties: Record<string, any>) => {
  const analytics = getFirebaseAnalytics();
  if (analytics) {
    setUserProperties(analytics, properties);
  }
};

// Quiz-specific events
export const trackQuizStarted = (quizId: string, quizTitle: string) => {
  trackEvent("quiz_started", { quiz_id: quizId, quiz_title: quizTitle });
};

export const trackQuizCompleted = (
  quizId: string,
  score: number,
  duration: number
) => {
  trackEvent("quiz_completed", {
    quiz_id: quizId,
    score,
    duration_seconds: duration,
  });
};

export const trackQuizShared = (quizId: string, platform: string) => {
  trackEvent("quiz_shared", { quiz_id: quizId, platform });
};

// User engagement events
export const trackLogin = (method: string) => {
  trackEvent("login", { method });
};

export const trackSignup = (method: string) => {
  trackEvent("sign_up", { method });
};

export const trackProfileUpdate = () => {
  trackEvent("profile_update");
};

// Gamification events
export const trackBadgeEarned = (badgeId: string, badgeName: string) => {
  trackEvent("badge_earned", { badge_id: badgeId, badge_name: badgeName });
};

export const trackLevelUp = (newLevel: number, xp: number) => {
  trackEvent("level_up", { new_level: newLevel, total_xp: xp });
};

export const trackStreakMilestone = (streakDays: number) => {
  trackEvent("streak_milestone", { streak_days: streakDays });
};

// Search and discovery
export const trackSearch = (searchTerm: string, resultsCount: number) => {
  trackEvent("search", {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackCategoryView = (category: string) => {
  trackEvent("category_view", { category });
};

// Social features
export const trackFriendAdded = () => {
  trackEvent("friend_added");
};

export const trackChallengeCreated = (challengeType: string) => {
  trackEvent("challenge_created", { challenge_type: challengeType });
};

export const trackChallengeAccepted = (challengeId: string) => {
  trackEvent("challenge_accepted", { challenge_id: challengeId });
};
