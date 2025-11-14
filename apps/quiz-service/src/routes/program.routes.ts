import { Router } from "express";
import {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/program.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", getAllPrograms);
router.get("/:id", getProgramById);

// Protected routes (admin only)
router.post("/", authenticate, createProgram);
router.put("/:id", authenticate, updateProgram);
router.delete("/:id", authenticate, deleteProgram);

export default router;
