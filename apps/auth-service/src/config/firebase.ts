/**
 * Firebase Admin SDK Configuration
 * Initialize Firebase Admin for backend services
 */

import * as admin from "firebase-admin";
import { logger } from "../utils/logger";

let db: admin.firestore.Firestore;

export const initializeFirebaseAdmin = () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: "quizhub-98649",
      });
      logger.info("✅ Firebase Admin initialized");
    }

    db = admin.firestore();
    return db;
  } catch (error) {
    logger.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
};

export const getFirestore = (): admin.firestore.Firestore => {
  if (!db) {
    db = initializeFirebaseAdmin();
  }
  return db;
};

export { admin };
