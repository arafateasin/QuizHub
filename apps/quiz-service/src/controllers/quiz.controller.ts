import { Response, NextFunction } from "express";
import {
  successResponse,
  NotFoundError,
  ValidationError,
  paginatedResponse,
  ForbiddenError,
} from "@quizhub/shared";
import { Quiz } from "../models/quiz.model";
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
    const userId = req.user?.userId;
    if (!userId) throw new ForbiddenError("User ID not found");

    const quiz = await Quiz.create({
      ...req.body,
      createdBy: userId,
    }) as any;

    logger.info(`Quiz created: ${quiz._id} by user ${userId}`);

    res.status(201).json(successResponse(quiz, "Quiz created successfully"));
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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const category = (req.query.category as string) || "";
    const difficulty = (req.query.difficulty as string) || "";

    const query: any = { isPublic: true };

    if (category) {
      query.category = category;
    }
    if (difficulty) {
      query.difficulty = difficulty.toUpperCase();
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Quiz.countDocuments(query);
    const quizzes = await Quiz.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(paginatedResponse(quizzes, page, limit, total));
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
    const { id } = req.params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }

    res.json(successResponse(quiz));
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
    const { id } = req.params;
    const userId = req.user?.userId;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }

    if (quiz.createdBy !== userId && req.user?.role !== "admin") {
      throw new ForbiddenError("You are not authorized to update this quiz");
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json(successResponse(updatedQuiz, "Quiz updated successfully"));
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
    const { id } = req.params;
    const userId = req.user?.userId;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }

    if (quiz.createdBy !== userId && req.user?.role !== "admin") {
      throw new ForbiddenError("You are not authorized to delete this quiz");
    }

    await Quiz.findByIdAndDelete(id);
    res.json(successResponse(null, "Quiz deleted successfully"));
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
    const userId = req.user?.userId;
    if (!userId) throw new ForbiddenError("User ID not found");

    const quizzes = await Quiz.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    res.json(successResponse(quizzes));
  } catch (error) {
    next(error);
  }
};
