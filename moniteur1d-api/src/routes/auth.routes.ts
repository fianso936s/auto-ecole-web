import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout, me, refresh } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../lib/validations/auth.schema.js";

const router = Router();

// Rate limiting spécifique pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 tentatives par IP
  message: "Trop de tentatives de connexion, réessayez dans 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", authenticate, me);

export default router;

