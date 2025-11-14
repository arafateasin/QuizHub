/**
 * Firebase Configuration
 * Central configuration for Firebase services used across QuizHub
 */

export const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyDQzIyWyRlpxZdwcF4eVQqK7yns_QbTNpM",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "quizhub-98649.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "quizhub-98649",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "quizhub-98649.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "113444927449",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:113444927449:web:846d144c88f1b2045bcbc8",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-VEMWBTK5DG",
};

/**
 * Firebase App Nickname
 */
export const FIREBASE_APP_NICKNAME = "QuizHub";

/**
 * Firebase Hosting Site
 */
export const FIREBASE_HOSTING_SITE = "quizhub-98649";
