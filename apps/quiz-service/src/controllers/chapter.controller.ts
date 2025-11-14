import { Request, Response, NextFunction } from "express";
// TODO: Create Firestore service for Chapter
// import Chapter from "../models/chapter.model";
import { logger } from "../utils/logger";

export const getAllChapters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Chapter functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error fetching chapters:", error);
    next(error);
  }
};

export const getChapterById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Chapter functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error fetching chapter:", error);
    next(error);
  }
};

export const createChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Chapter functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error creating chapter:", error);
    next(error);
  }
};

export const updateChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Chapter functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error updating chapter:", error);
    next(error);
  }
};

export const deleteChapter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Chapter functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error deleting chapter:", error);
    next(error);
  }
};
