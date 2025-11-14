import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getUserById,
  getUsers,
  deleteUser,
} from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  updateProfileValidation,
  validateRequest,
} from "../middleware/validation.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get("/profile", getProfile);
router.put("/profile", updateProfileValidation, validateRequest, updateProfile);
router.get("/:id", getUserById);
router.get("/", authorize("admin"), getUsers);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
