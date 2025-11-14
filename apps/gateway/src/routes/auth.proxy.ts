import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { logger } from "../utils/logger";

const router = Router();

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";

// Proxy all auth and user routes to auth service
router.use(
  "/",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    timeout: 30000, // 30 seconds timeout
    proxyTimeout: 30000,
    pathRewrite: {
      "^/api/auth": "/api/auth",
      "^/api/users": "/api/users",
    },
    onProxyReq: (proxyReq, req, res) => {
      logger.info(
        `[GATEWAY] Proxying to Auth Service: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}${req.url}`
      );
    },
    onProxyRes: (proxyRes, req, res) => {
      logger.info(
        `[GATEWAY] Auth Service response: ${proxyRes.statusCode} for ${req.method} ${req.url}`
      );
    },
    onError: (err, req, res) => {
      logger.error(
        `[GATEWAY] Auth Service proxy error for ${req.method} ${req.url}:`,
        err.message
      );
      (res as any).status(503).json({
        success: false,
        error: "Auth service unavailable",
      });
    },
  })
);

export default router;
