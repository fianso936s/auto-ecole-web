import { Router } from "express";
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
} from "../controllers/exam.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../lib/auth/guards.js";

const router = Router();

router.use(authenticate);

router.get("/", getExams);
router.get("/:id", getExamById);
router.post("/", requireRole(["ADMIN", "INSTRUCTOR"]), createExam);
router.patch("/:id", requireRole(["ADMIN", "INSTRUCTOR"]), updateExam);

export default router;

