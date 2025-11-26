import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { logger } from "./utils/logger";
import authProxy from "./routes/auth.proxy";
import quizProxy from "./routes/quiz.proxy";
import { errorHandler } from "./middleware/error.middleware";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});
app.use("/api/", limiter);

// Service routes
app.use("/api/auth", authProxy);
app.use("/api/users", authProxy);
app.use("/api/quizzes", quizProxy);
app.use("/api/attempts", quizProxy);

// Body parsing (must be after proxies to avoid consuming stream)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
  logger.info(`🔗 Auth Service: ${process.env.AUTH_SERVICE_URL}`);
  logger.info(`🔗 Quiz Service: ${process.env.QUIZ_SERVICE_URL}`);
});

export default app;
