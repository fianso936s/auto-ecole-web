import { Router } from "express";
import { 
  createLessonRequest, 
  getLessonRequests, 
  acceptLessonRequest, 
  rejectLessonRequest 
} from "../controllers/request.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../lib/auth/guards.js";

const router = Router();

router.use(authenticate);

router.post("/", requireRole(["STUDENT"]), createLessonRequest);
router.get("/", getLessonRequests);
router.post("/:id/accept", requireRole(["ADMIN", "INSTRUCTOR"]), acceptLessonRequest);
router.post("/:id/reject", requireRole(["ADMIN", "INSTRUCTOR"]), rejectLessonRequest);

export default router;

