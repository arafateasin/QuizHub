import { Response, NextFunction } from "express";
import {
  successResponse,
  NotFoundError,
  ValidationError,
  calculatePercentage,
  XP_REWARDS,
} from "@quizhub/shared";
// TODO: Create Firestore services for Quiz and Attempt
// import { Quiz } from "../models/quiz.model";
// import { Attempt } from "../models/attempt.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../utils/logger";

/**
 * @swagger
 * /api/attempts/start:
 *   post:
 *     summary: Start a quiz attempt
 *     tags: [Attempt]
 *     security:
 *       - bearerAuth: []
 */
export const startAttempt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement with Firestore
    res.status(501).json({
      success: false,
      error: "Quiz attempt functionality is being migrated to Firestore",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/attempts/{id}/submit:
 *   post:
 *     summary: Submit quiz answers
 *     tags: [Attempt]
 *     security:
 *       - bearerAuth: []
 */
export const submitAttempt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement with Firestore
    res.status(501).json({
      success: false,
      error: "Quiz attempt functionality is being migrated to Firestore",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/attempts/{id}:
 *   get:
 *     summary: Get attempt details
 *     tags: [Attempt]
 *     security:
 *       - bearerAuth: []
 */
export const getAttempt = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement with Firestore
    res.status(501).json({
      success: false,
      error: "Quiz attempt functionality is being migrated to Firestore",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/attempts/user/history:
 *   get:
 *     summary: Get user's attempt history
 *     tags: [Attempt]
 *     security:
 *       - bearerAuth: []
 */
export const getUserAttempts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // TODO: Implement with Firestore
    res.status(501).json({
      success: false,
      error: "Quiz attempt functionality is being migrated to Firestore",
    });
  } catch (error) {
    next(error);
  }
};
