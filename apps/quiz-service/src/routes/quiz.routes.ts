import { Router } from "express";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  getMyQuizzes,
} from "../controllers/quiz.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createQuiz);
router.get("/", getQuizzes);
router.get("/user/my-quizzes", authenticate, getMyQuizzes);
router.get("/:id", getQuizById);
router.put("/:id", authenticate, updateQuiz);
router.delete("/:id", authenticate, deleteQuiz);

export default router;
