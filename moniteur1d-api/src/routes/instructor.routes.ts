import { Router } from "express";
import { 
  getInstructors, 
  createInstructor, 
  getInstructorById, 
  updateInstructor, 
  toggleInstructorActive,
  deleteInstructor 
} from "../controllers/instructor.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../lib/auth/guards.js";

const router = Router();

router.use(authenticate);
router.use(requireRole(["ADMIN"]));

router.get("/", getInstructors);
router.post("/", createInstructor);
router.get("/:id", getInstructorById);
router.patch("/:id", updateInstructor);
router.patch("/:id/active", toggleInstructorActive);
router.delete("/:id", deleteInstructor);

export default router;

