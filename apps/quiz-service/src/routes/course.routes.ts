import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Protected routes (admin only - you can add admin middleware later)
router.post("/", authenticate, createCourse);
router.put("/:id", authenticate, updateCourse);
router.delete("/:id", authenticate, deleteCourse);

export default router;
