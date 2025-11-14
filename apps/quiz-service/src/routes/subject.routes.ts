import { Router } from "express";
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);

// Protected routes (admin only)
router.post("/", authenticate, createSubject);
router.put("/:id", authenticate, updateSubject);
router.delete("/:id", authenticate, deleteSubject);

export default router;
