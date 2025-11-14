import { Router } from "express";
import {
  startAttempt,
  submitAttempt,
  getAttempt,
  getUserAttempts,
} from "../controllers/attempt.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post("/start", startAttempt);
router.post("/:id/submit", submitAttempt);
router.get("/:id", getAttempt);
router.get("/user/history", getUserAttempts);

export default router;
