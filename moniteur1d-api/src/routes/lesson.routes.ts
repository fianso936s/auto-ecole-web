import { Router } from "express";
import { 
  getLessons, 
  createLesson, 
  updateLesson, 
  confirmLesson,
  cancelLesson,
  completeLesson 
} from "../controllers/lesson.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../lib/auth/guards.js";

const router = Router();

router.use(authenticate);

router.get("/", getLessons);
router.post("/", requireRole(["ADMIN", "INSTRUCTOR"]), createLesson);
router.patch("/:id", requireRole(["ADMIN", "INSTRUCTOR"]), updateLesson);
router.post("/:id/confirm", requireRole(["ADMIN", "INSTRUCTOR"]), confirmLesson);
router.post("/:id/cancel", cancelLesson); // Géré à l'intérieur pour les règles 48h
router.post("/:id/complete", requireRole(["INSTRUCTOR"]), completeLesson);

export default router;

