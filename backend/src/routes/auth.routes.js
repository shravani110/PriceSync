import { Router } from "express";
import { register, login, me, verifyEmail, resendVerification } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", requireAuth, resendVerification);

export default router;
