import { Router } from "express";
import {
  getAllChapters,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
} from "../controllers/chapter.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllChapters);
router.get("/:id", getChapterById);

// Protected routes (admin only)
router.post("/", authenticate, createChapter);
router.put("/:id", authenticate, updateChapter);
router.delete("/:id", authenticate, deleteChapter);

export default router;
