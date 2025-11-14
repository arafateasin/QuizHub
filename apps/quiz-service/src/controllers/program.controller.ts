import { Request, Response, NextFunction } from "express";
// TODO: Create Firestore service for Program
// import Program from "../models/program.model";
import { logger } from "../utils/logger";

export const getAllPrograms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Program functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error fetching programs:", error);
    next(error);
  }
};

export const getProgramById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Program functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error fetching program:", error);
    next(error);
  }
};

export const createProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Program functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error creating program:", error);
    next(error);
  }
};

export const updateProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Program functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error updating program:", error);
    next(error);
  }
};

export const deleteProgram = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(501)
      .json({
        success: false,
        error: "Program functionality is being migrated to Firestore",
      });
  } catch (error) {
    logger.error("Error deleting program:", error);
    next(error);
  }
};
