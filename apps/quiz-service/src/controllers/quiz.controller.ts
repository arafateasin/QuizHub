import { Response, NextFunction } from "express";
import {
  successResponse,
  NotFoundError,
  ValidationError,
  paginatedResponse,
  ForbiddenError,
} from "@quizhub/shared";
// TODO: Create Firestore services for Quiz and Attempt
// import { Quiz } from "../models/quiz.model";
// import { Attempt } from "../models/attempt.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { logger } from "../utils/logger";

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 */
export const createQuiz = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Quiz functionality is being migrated to Firestore",
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes (paginated)
 *     tags: [Quiz]
 */
export const getQuizzes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Quiz functionality is being migrated to Firestore",
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get quiz by ID
 *     tags: [Quiz]
 */
export const getQuizById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Quiz functionality is being migrated to Firestore",
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     summary: Update quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 */
export const updateQuiz = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Quiz functionality is being migrated to Firestore",
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Delete quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 */
export const deleteQuiz = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Quiz functionality is being migrated to Firestore",
      });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/quizzes/user/my-quizzes:
 *   get:
 *     summary: Get quizzes created by current user
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 */
export const getMyQuizzes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Quiz functionality is being migrated to Firestore",
      });
  } catch (error) {
    next(error);
  }
};
