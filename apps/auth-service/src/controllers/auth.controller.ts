import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {
  successResponse,
  errorResponse,
  ValidationError,
  UnauthorizedError,
} from "@quizhub/shared";
import { userService } from "../services/user.service";
import { generateTokenPair, verifyRefreshToken } from "../utils/jwt.utils";
import { logger } from "../utils/logger";

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await userService.findByEmail(email);

    if (existingUser) {
      throw new ValidationError("Email or username already exists");
    }

    // Create new user
    const user = await userService.createUser({
      email,
      username,
      password,
      role: role || "student",
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(
      user.id,
      user.email,
      user.role
    );

    // Save refresh token
    await userService.updateUser(user.id, {
      refreshToken,
    });

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json(
      successResponse(
        {
          user: userService.toJSON(user),
          accessToken,
          refreshToken,
        },
        "User registered successfully",
        201
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await userService.comparePassword(
      user.id,
      password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(
      user.id,
      user.email,
      user.role
    );

    // Save refresh token and update last login
    await userService.updateUser(user.id, {
      refreshToken,
      lastLogin: new Date(),
    });

    logger.info(`User logged in: ${user.email}`);

    res.json(
      successResponse({
        user: userService.toJSON(user),
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new UnauthorizedError("Refresh token required");
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Find user and verify refresh token matches
    const user = await userService.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // Generate new tokens
    const tokens = generateTokenPair(user.id, user.email, user.role);

    // Update refresh token
    await userService.updateUser(user.id, {
      refreshToken: tokens.refreshToken,
    });

    res.json(successResponse(tokens));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (userId) {
      await userService.updateUser(userId, {
        refreshToken: undefined,
      });
    }

    res.json(successResponse(null, "Logged out successfully"));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     summary: Validate JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Token is invalid
 */
export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = (req as any).user;

    res.json(
      successResponse({
        valid: true,
        user,
      })
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/auth/firebase-exchange:
 *   post:
 *     summary: Exchange Firebase ID token for backend JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firebaseToken
 *             properties:
 *               firebaseToken:
 *                 type: string
 *                 description: Firebase ID token
 *     responses:
 *       200:
 *         description: Tokens generated successfully
 *       401:
 *         description: Invalid Firebase token
 */
export const exchangeFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info(`[AUTH] Firebase token exchange request received`);
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      logger.error(`[AUTH] No Firebase token provided in request body`);
      throw new ValidationError("Firebase token is required");
    }

    logger.info(`[AUTH] Verifying Firebase token...`);

    // Verify Firebase token with Firebase Admin SDK
    const { admin } = await import("../config/firebase-admin");
    let decoded: any;

    try {
      decoded = await admin.auth().verifyIdToken(firebaseToken);
    } catch (verifyError: any) {
      logger.error(
        `Firebase token verification failed: ${verifyError.message}`
      );
      throw new UnauthorizedError("Invalid Firebase token");
    }

    if (!decoded || !decoded.email) {
      throw new UnauthorizedError("Invalid Firebase token - missing email");
    }

    // Find or create user
    let user = await userService.findByEmail(decoded.email);

    if (!user) {
      // Create new user from Firebase data
      const username =
        decoded.name?.replace(/\s+/g, "").toLowerCase() ||
        decoded.email.split("@")[0];

      user = await userService.createUser({
        email: decoded.email,
        username,
        password: `FIREBASE_${decoded.uid}`, // Placeholder - not used for Firebase users
        role: "student" as any,
        isVerified: decoded.email_verified || false,
        firebaseUid: decoded.uid,
        displayName: decoded.name,
      });

      // Update profile after creation
      if (decoded.name || decoded.picture) {
        await userService.updateUser(user.id, {
          profile: {
            firstName: decoded.name?.split(" ")[0] || "",
            lastName: decoded.name?.split(" ").slice(1).join(" ") || "",
            avatar: decoded.picture || "",
          },
        });

        // Refresh user data
        const refreshedUser = await userService.findById(user.id);
        if (refreshedUser) user = refreshedUser;
      }

      logger.info(`New user created from Firebase: ${user.email}`);
    }

    // Generate backend JWT tokens
    const { accessToken, refreshToken } = generateTokenPair(
      user.id,
      user.email,
      user.role
    );

    // Save refresh token
    await userService.updateUser(user.id, {
      refreshToken,
      lastLogin: new Date(),
    });

    logger.info(`Firebase token exchanged for user: ${user.email}`);

    res.json(
      successResponse({
        user: userService.toJSON(user),
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    next(error);
  }
};
