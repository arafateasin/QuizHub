import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { logger } from "../utils/logger";

const router = Router();

const QUIZ_SERVICE_URL =
  process.env.QUIZ_SERVICE_URL || "http://localhost:3002";

// Proxy all quiz and attempt routes to quiz service
router.use(
  "/",
  createProxyMiddleware({
    target: QUIZ_SERVICE_URL,
    changeOrigin: true,
    timeout: 30000, // 30 seconds timeout
    proxyTimeout: 30000,
    pathRewrite: {
      "^/api/quizzes": "/api/quizzes",
      "^/api/attempts": "/api/attempts",
    },
    onProxyReq: (proxyReq, req, res) => {
      logger.info(
        `[GATEWAY] Proxying to Quiz Service: ${req.method} ${req.url} -> ${QUIZ_SERVICE_URL}${req.url}`
      );
    },
    onProxyRes: (proxyRes, req, res) => {
      logger.info(
        `[GATEWAY] Quiz Service response: ${proxyRes.statusCode} for ${req.method} ${req.url}`
      );
    },
    onError: (err, req, res) => {
      logger.error(
        `[GATEWAY] Quiz Service proxy error for ${req.method} ${req.url}:`,
        err.message
      );
      (res as any).status(503).json({
        success: false,
        error: "Quiz service unavailable",
      });
    },
  })
);

export default router;
