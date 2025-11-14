import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { initializeFirebaseAdmin } from "./config/firebase-admin";
import { logger } from "./utils/logger";
import quizRoutes from "./routes/quiz.routes";
import attemptRoutes from "./routes/attempt.routes";
import courseRoutes from "./routes/course.routes";
import programRoutes from "./routes/program.routes";
import subjectRoutes from "./routes/subject.routes";
import chapterRoutes from "./routes/chapter.routes";
import { errorHandler } from "./middleware/error.middleware";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3002;

// Middleware
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: "quiz-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/quizzes", quizRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);

// Swagger Documentation
setupSwagger(app);

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
const startServer = async () => {
  try {
    // Initialize Firebase Admin SDK
    initializeFirebaseAdmin();
    logger.info("✅ Firebase Admin SDK initialized");

    app.listen(PORT, () => {
      logger.info(`🚀 Quiz Service running on port ${PORT}`);
      logger.info(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
