import { Router } from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  validateToken,
  exchangeFirebaseToken,
} from "../controllers/auth.controller";
import {
  signupValidation,
  loginValidation,
  validateRequest,
} from "../middleware/validation.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signupValidation, validateRequest, signup);
router.post("/login", loginValidation, validateRequest, login);
router.post("/firebase-exchange", exchangeFirebaseToken);
router.post("/exchange-firebase-token", exchangeFirebaseToken); // Alias for compatibility
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logout);
router.get("/validate", authenticate, validateToken);

export default router;
