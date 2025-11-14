import { Request, Response, NextFunction } from "express";
// TODO: Create Firestore service for Subject
// import Subject from "../models/subject.model";
import { logger } from "../utils/logger";

export const getAllSubjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Subject functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error fetching subjects:", error);
    next(error);
  }
};

export const getSubjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Subject functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error fetching subject:", error);
    next(error);
  }
};

export const createSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Subject functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error creating subject:", error);
    next(error);
  }
};

export const updateSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Subject functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error updating subject:", error);
    next(error);
  }
};

export const deleteSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Subject functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error deleting subject:", error);
    next(error);
  }
};
