import { Request, Response, NextFunction } from "express";
// TODO: Create Firestore service for Course
// import Course from "../models/course.model";
import { logger } from "../utils/logger";

const MIGRATION_MESSAGE = "Course functionality is being migrated to Firestore";

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(501).json({ success: false, error: MIGRATION_MESSAGE });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(501).json({ success: false, error: MIGRATION_MESSAGE });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(501).json({ success: false, error: MIGRATION_MESSAGE });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(501).json({ success: false, error: MIGRATION_MESSAGE });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(501).json({ success: false, error: MIGRATION_MESSAGE });
  } catch (error) {
    next(error);
  }
};
