/**
 * Firebase Admin SDK Configuration
 */
import * as admin from "firebase-admin";
import { logger } from "../utils/logger";

let firebaseApp: admin.app.App;

export const initializeFirebaseAdmin = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "quizhub-98649",
    });

    logger.info("✅ Firebase Admin SDK initialized");
    return firebaseApp;
  } catch (error) {
    logger.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
};

export const getFirestore = () => {
  if (!firebaseApp) {
    initializeFirebaseAdmin();
  }
  return admin.firestore();
};

export const getAuth = () => {
  if (!firebaseApp) {
    initializeFirebaseAdmin();
  }
  return admin.auth();
};

export { admin };
