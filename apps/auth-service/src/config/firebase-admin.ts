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
    let credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      // Parse JSON from environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      credential = admin.credential.cert(serviceAccount);
    } else {
      // Fallback to default (GOOGLE_APPLICATION_CREDENTIALS path)
      credential = admin.credential.applicationDefault();
    }

    firebaseApp = admin.initializeApp({
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID,
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
