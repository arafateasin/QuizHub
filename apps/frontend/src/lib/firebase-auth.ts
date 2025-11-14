/**
 * Firebase Authentication Helper Functions
 * Wrapper functions for Firebase Auth operations
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import {
  trackLogin,
  trackSignup,
  setAnalyticsUserId,
} from "./firebase-analytics";

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> => {
  const auth = getFirebaseAuth();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Update profile with display name if provided
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }

  // Send verification email
  await sendEmailVerification(userCredential.user);

  // Track signup
  trackSignup("email");
  setAnalyticsUserId(userCredential.user.uid);

  return userCredential;
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  const auth = getFirebaseAuth();
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Track login
  trackLogin("email");
  setAnalyticsUserId(userCredential.user.uid);

  return userCredential;
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);

  // Track login
  trackLogin("google");
  setAnalyticsUserId(userCredential.user.uid);

  return userCredential;
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<void> => {
  const auth = getFirebaseAuth();

  // Clear backend tokens
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  await signOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user signed in");
  }

  await updateProfile(user, updates);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user's ID token
 */
export const getUserToken = async (): Promise<string | null> => {
  const user = getCurrentUser();
  if (!user) return null;

  return await user.getIdToken();
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (): Promise<void> => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No user signed in");
  }

  await sendEmailVerification(user);
};
