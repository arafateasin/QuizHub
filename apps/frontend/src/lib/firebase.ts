/**
 * Firebase Client SDK Initialization
 * This module initializes Firebase services for the frontend
 */

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { firebaseConfig } from "@quizhub/shared/src/firebase.config";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

/**
 * Initialize Firebase
 * Only initializes once even if called multiple times
 */
export const initializeFirebase = () => {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize Analytics only in browser and if supported
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  }

  return { app, auth, db, storage, analytics };
};

// Initialize Firebase on module load
const firebaseServices = initializeFirebase();

// Export initialized services
export { firebaseServices };
export const firebaseAuth = firebaseServices.auth;
export const firebaseDb = firebaseServices.db;
export const firebaseStorage = firebaseServices.storage;
export const firebaseAnalytics = firebaseServices.analytics;

/**
 * Get Firebase Auth instance
 */
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    const { auth: authInstance } = initializeFirebase();
    auth = authInstance;
  }

  // Ensure persistence is set (should be LOCAL by default, but explicitly set it)
  if (typeof window !== "undefined") {
    import("firebase/auth").then(
      ({ browserLocalPersistence, setPersistence }) => {
        setPersistence(auth, browserLocalPersistence).catch((error) => {
          console.error("Failed to set auth persistence:", error);
        });
      }
    );
  }

  return auth;
};

/**
 * Get Firestore instance
 */
export const getFirebaseDb = (): Firestore => {
  if (!db) {
    const { db: dbInstance } = initializeFirebase();
    db = dbInstance;
  }
  return db;
};

/**
 * Get Firebase Storage instance
 */
export const getFirebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    const { storage: storageInstance } = initializeFirebase();
    storage = storageInstance;
  }
  return storage;
};

/**
 * Get Firebase Analytics instance (may be null)
 */
export const getFirebaseAnalytics = (): Analytics | null => {
  return analytics;
};
