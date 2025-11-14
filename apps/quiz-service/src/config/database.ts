// MongoDB connection has been deprecated - now using Firestore
// TODO: Remove this file once migration is complete
import { logger } from "../utils/logger";

export const connectDatabase = async (): Promise<void> => {
  logger.warn("MongoDB connection is deprecated. Using Firestore instead.");
};
