/**
 * User Service - Firestore Implementation
 * Handles all user-related database operations
 */

import bcrypt from "bcryptjs";
import { getFirestore, admin } from "../config/firebase-admin";
import { UserRole } from "@quizhub/shared";
import { logger } from "../utils/logger";

export interface IUser {
  id: string;
  email: string;
  username: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
  firebaseUid?: string;
  displayName?: string;
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    institution?: string;
    grade?: string;
  };
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = "users";

export class UserService {
  private db: admin.firestore.Firestore;

  constructor() {
    this.db = getFirestore();
  }

  /**
   * Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password with user ID
   */
  async comparePassword(
    userId: string,
    candidatePassword: string
  ): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) {
      return false;
    }
    return bcrypt.compare(candidatePassword, user.password);
  }

  /**
   * Compare password directly
   */
  async comparePasswordDirect(
    candidatePassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  /**
   * Remove sensitive fields from user object
   */
  private sanitizeUser(user: any): Partial<IUser> {
    const {
      password,
      refreshToken,
      verificationToken,
      resetPasswordToken,
      resetPasswordExpires,
      ...sanitized
    } = user;
    return sanitized;
  }

  /**
   * Create a new user (alias)
   */
  async createUser(userData: {
    email: string;
    username: string;
    password: string;
    role?: UserRole;
    firebaseUid?: string;
    displayName?: string;
    isVerified?: boolean;
  }): Promise<IUser> {
    return this.create(userData);
  }

  /**
   * Update user (alias)
   */
  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    return this.update(id, updates);
  }

  /**
   * Create a new user
   */
  async create(userData: {
    email: string;
    username: string;
    password: string;
    role?: UserRole;
    firebaseUid?: string;
    displayName?: string;
    isVerified?: boolean;
  }): Promise<IUser> {
    const hashedPassword = await this.hashPassword(userData.password);

    const now = admin.firestore.FieldValue.serverTimestamp();
    const userDoc = {
      email: userData.email.toLowerCase().trim(),
      username: userData.username.trim(),
      password: hashedPassword,
      role: userData.role || UserRole.STUDENT,
      isVerified: userData.isVerified || false,
      firebaseUid: userData.firebaseUid,
      displayName: userData.displayName,
      profile: {},
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.db.collection(COLLECTION_NAME).add(userDoc);
    const doc = await docRef.get();

    return {
      id: doc.id,
      ...(doc.data() as any),
    };
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    const doc = await this.db.collection(COLLECTION_NAME).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...(doc.data() as any),
    };
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    const snapshot = await this.db
      .collection(COLLECTION_NAME)
      .where("email", "==", email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...(doc.data() as any),
    };
  }

  /**
   * Find user by username
   */
  async findByUsername(username: string): Promise<IUser | null> {
    const snapshot = await this.db
      .collection(COLLECTION_NAME)
      .where("username", "==", username.trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...(doc.data() as any),
    };
  }

  /**
   * Update user
   */
  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const docRef = this.db.collection(COLLECTION_NAME).doc(id);

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await this.hashPassword(updates.password);
    }

    await docRef.update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return this.findById(id);
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    await this.db.collection(COLLECTION_NAME).doc(id).delete();
  }

  /**
   * Get all users with optional limit
   */
  async getAllUsers(limit: number = 50): Promise<IUser[]> {
    const snapshot = await this.db
      .collection(COLLECTION_NAME)
      .limit(limit)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));
  }

  /**
   * Get sanitized user (without sensitive fields)
   */
  toJSON(user: IUser): Partial<IUser> {
    const sanitized = this.sanitizeUser(user);
    
    // Convert Firestore Timestamps to Dates/Strings
    if (sanitized.createdAt && typeof (sanitized.createdAt as any).toDate === 'function') {
      sanitized.createdAt = (sanitized.createdAt as any).toDate();
    }
    
    if (sanitized.updatedAt && typeof (sanitized.updatedAt as any).toDate === 'function') {
      sanitized.updatedAt = (sanitized.updatedAt as any).toDate();
    }
    
    return sanitized;
  }
}

export const userService = new UserService();
