/**
 * Firestore Helper Functions
 * Common Firestore operations for QuizHub
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  Timestamp,
  writeBatch,
  increment,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

/**
 * Collections
 */
export const COLLECTIONS = {
  USERS: "users",
  QUIZZES: "quizzes",
  ATTEMPTS: "attempts",
  COURSES: "courses",
  PROGRAMS: "programs",
  SUBJECTS: "subjects",
  CHAPTERS: "chapters",
  LEADERBOARD: "leaderboard",
} as const;

/**
 * Get a single document by ID
 */
export const getDocument = async <T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

/**
 * Get multiple documents with optional filters
 */
export const getDocuments = async <T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const db = getFirebaseDb();
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
};

/**
 * Create a new document with auto-generated ID
 */
export const createDocument = async <T = DocumentData>(
  collectionName: string,
  data: Omit<T, "id">
): Promise<string> => {
  const db = getFirebaseDb();
  const collectionRef = collection(db, collectionName);
  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

/**
 * Create or update a document with specific ID
 */
export const setDocument = async <T = DocumentData>(
  collectionName: string,
  docId: string,
  data: Omit<T, "id">,
  merge = true
): Promise<void> => {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionName, docId);
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: Timestamp.now(),
    },
    { merge }
  );
};

/**
 * Update specific fields in a document
 */
export const updateDocument = async (
  collectionName: string,
  docId: string,
  updates: Partial<DocumentData>
): Promise<void> => {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  const db = getFirebaseDb();
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string) => {
  return getDocument(COLLECTIONS.USERS, userId);
};

/**
 * Create or update user profile
 */
export const saveUserProfile = async (
  userId: string,
  profile: {
    email: string;
    displayName?: string;
    photoURL?: string;
    role?: string;
    xp?: number;
    level?: number;
  }
) => {
  await setDocument(COLLECTIONS.USERS, userId, profile);
};

/**
 * Get user quiz attempts
 */
export const getUserAttempts = async (userId: string, limitCount = 10) => {
  return getDocuments(COLLECTIONS.ATTEMPTS, [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  ]);
};

/**
 * Save quiz attempt
 */
export const saveQuizAttempt = async (attemptData: {
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: any[];
}) => {
  return createDocument(COLLECTIONS.ATTEMPTS, attemptData);
};

/**
 * Get quizzes by course/program/subject/chapter
 */
export const getQuizzesByHierarchy = async (filters: {
  courseId?: string;
  programId?: string;
  subjectId?: string;
  chapterId?: string;
  isDefault?: boolean;
}) => {
  const constraints: QueryConstraint[] = [];

  if (filters.courseId) {
    constraints.push(where("courseId", "==", filters.courseId));
  }
  if (filters.programId) {
    constraints.push(where("programId", "==", filters.programId));
  }
  if (filters.subjectId) {
    constraints.push(where("subjectId", "==", filters.subjectId));
  }
  if (filters.chapterId) {
    constraints.push(where("chapterId", "==", filters.chapterId));
  }
  if (filters.isDefault !== undefined) {
    constraints.push(where("isDefault", "==", filters.isDefault));
  }

  constraints.push(orderBy("createdAt", "desc"));

  return getDocuments(COLLECTIONS.QUIZZES, constraints);
};

/**
 * Get courses
 */
export const getCourses = async () => {
  return getDocuments(COLLECTIONS.COURSES, [
    where("isActive", "==", true),
    orderBy("order", "asc"),
  ]);
};

/**
 * Get programs by course
 */
export const getProgramsByCourse = async (courseId: string) => {
  return getDocuments(COLLECTIONS.PROGRAMS, [
    where("courseId", "==", courseId),
    where("isActive", "==", true),
    orderBy("order", "asc"),
  ]);
};

/**
 * Get subjects by program
 */
export const getSubjectsByProgram = async (programId: string) => {
  return getDocuments(COLLECTIONS.SUBJECTS, [
    where("programId", "==", programId),
    where("isActive", "==", true),
    orderBy("order", "asc"),
  ]);
};

/**
 * Get chapters by subject
 */
export const getChaptersBySubject = async (subjectId: string) => {
  return getDocuments(COLLECTIONS.CHAPTERS, [
    where("subjectId", "==", subjectId),
    where("isActive", "==", true),
    orderBy("order", "asc"),
  ]);
};

/**
 * Update user XP and level
 */
export const updateUserXP = async (userId: string, xpToAdd: number) => {
  const db = getFirebaseDb();
  const userRef = doc(db, COLLECTIONS.USERS, userId);

  await updateDoc(userRef, {
    xp: increment(xpToAdd),
    updatedAt: Timestamp.now(),
  });

  // Get updated profile to check level
  const updatedProfile = await getDocument(COLLECTIONS.USERS, userId);
  return updatedProfile;
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (limitCount = 10) => {
  return getDocuments(COLLECTIONS.USERS, [
    orderBy("xp", "desc"),
    limit(limitCount),
  ]);
};

/**
 * Batch operations example
 */
export const batchUpdateDocuments = async (
  operations: Array<{
    collection: string;
    docId: string;
    data: Partial<DocumentData>;
  }>
) => {
  const db = getFirebaseDb();
  const batch = writeBatch(db);

  operations.forEach(({ collection: collectionName, docId, data }) => {
    const docRef = doc(db, collectionName, docId);
    batch.update(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  });

  await batch.commit();
};
