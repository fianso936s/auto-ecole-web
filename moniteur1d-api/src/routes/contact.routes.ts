import { Router } from "express";
import { submitContact } from "../controllers/contact.controller.js";
import rateLimit from "express-rate-limit";

const router = Router();

// Specific rate limit for contact form to prevent spam
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 contact submissions per hour
  message: { message: "Trop de tentatives. Veuillez réessayer plus tard." }
});

router.post("/", contactLimiter, submitContact);

export default router;

