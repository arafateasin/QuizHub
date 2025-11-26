import { Response, NextFunction } from "express";
import {
  successResponse,
  NotFoundError,
  ValidationError,
  calculatePercentage,
  XP_REWARDS,
  ForbiddenError,
} from "@quizhub/shared";
import { Attempt } from "../models/attempt.model";
import { Quiz } from "../models/quiz.model";
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
    const { quizId } = req.body;
    const userId = req.user?.userId;

    if (!quizId) throw new ValidationError("Quiz ID is required");
    if (!userId) throw new ForbiddenError("User ID not found");

    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }

    const attempt = await Attempt.create({
      quizId,
      userId,
      status: "IN_PROGRESS",
    });

    logger.info(`Quiz attempt started: ${attempt._id} for quiz ${quizId} by user ${userId}`);

    res.status(201).json(successResponse(attempt, "Quiz attempt started"));
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
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user?.userId;

    if (!userId) throw new ForbiddenError("User ID not found");

    const attempt = await Attempt.findById(id);

    if (!attempt) {
      throw new NotFoundError("Attempt not found");
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenError("You are not authorized to submit this attempt");
    }

    if (attempt.status === "COMPLETED") {
      throw new ValidationError("Attempt already submitted");
    }

    // Fetch quiz to grade answers
    const quiz = await Quiz.findById(attempt.quizId);
    if (!quiz) {
      throw new NotFoundError("Quiz not found");
    }

    // Grading logic
    let score = 0;
    let totalPoints = 0;
    const gradedAnswers = [];

    for (const question of quiz.questions) {
      totalPoints += question.points;
      // @ts-ignore - _id is added by Mongoose
      const questionId = question._id.toString();
      
      const userAnswer = answers.find((a: any) => a.questionId === questionId);
      
      // Simple exact match grading for now
      const isCorrect = userAnswer && String(userAnswer.userAnswer) === String(question.correctAnswer);
      
      const pointsEarned = isCorrect ? question.points : 0;
      score += pointsEarned;

      gradedAnswers.push({
        questionId,
        userAnswer: userAnswer?.userAnswer,
        isCorrect,
        pointsEarned,
      });
    }

    const percentage = calculatePercentage(score, totalPoints);
    const isPassed = percentage >= quiz.passingScore;
    
    // Calculate XP
    const xpEarned = isPassed ? (XP_REWARDS?.QUIZ_COMPLETION || 50) : 10;

    attempt.status = "COMPLETED";
    attempt.completedAt = new Date();
    attempt.answers = gradedAnswers;
    attempt.score = score;
    attempt.percentage = percentage;
    attempt.isPassed = isPassed;
    attempt.xpEarned = xpEarned;

    await attempt.save();

    // Update quiz stats
    await Quiz.findByIdAndUpdate(attempt.quizId, {
      $inc: { totalAttempts: 1 },
    });

    logger.info(`Quiz attempt submitted: ${id}. Score: ${score}/${totalPoints} (${percentage}%)`);

    res.json(successResponse(attempt, "Quiz submitted successfully"));
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
    const { id } = req.params;
    const userId = req.user?.userId;

    const attempt = await Attempt.findById(id);

    if (!attempt) {
      throw new NotFoundError("Attempt not found");
    }

    // Only allow user who created attempt or admin to view
    if (attempt.userId !== userId && req.user?.role !== "admin") {
      throw new ForbiddenError("You are not authorized to view this attempt");
    }

    res.json(successResponse(attempt));
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
    const userId = req.user?.userId;
    if (!userId) throw new ForbiddenError("User ID not found");

    const limit = parseInt(req.query.limit as string) || 10;
    
    const attempts = await Attempt.find({ userId })
      .sort({ startedAt: -1 })
      .limit(limit)
      .populate("quizId", "title category difficulty");

    // Transform to match expected frontend format where quiz is a nested object
    const transformedAttempts = attempts.map(attempt => {
      const attemptObj = attempt.toObject();
      return {
        ...attemptObj,
        quiz: attemptObj.quizId // Rename quizId to quiz for frontend compatibility
      };
    });

    res.json(successResponse(transformedAttempts));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/attempts/user/stats:
 *   get:
 *     summary: Get user's quiz statistics
 *     tags: [Attempt]
 *     security:
 *       - bearerAuth: []
 */
export const getUserStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new ForbiddenError("User ID not found");

    const attempts = await Attempt.find({ 
      userId, 
      status: "COMPLETED" 
    });

    const quizzesCompleted = attempts.length;
    const totalXp = attempts.reduce((sum, attempt) => sum + (attempt.xpEarned || 0), 0);
    
    // Calculate average score
    const averageScore = quizzesCompleted > 0
      ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / quizzesCompleted)
      : 0;

    // Get recent badges (mock logic for now, or derive from achievements if available)
    // For now, we'll return an empty array or basic stats, as badges might be in a separate service or table
    
    res.json(successResponse({
      quizzesCompleted,
      totalXp,
      averageScore,
    }));
  } catch (error) {
    next(error);
  }
};
