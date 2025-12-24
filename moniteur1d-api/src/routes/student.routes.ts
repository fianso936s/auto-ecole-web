import { Router } from "express";
import { 
  getStudents, 
  createStudent, 
  getStudentById, 
  updateStudent, 
  deleteStudent 
} from "../controllers/student.controller.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../lib/auth/guards.js";

const router = Router();

// Toutes les routes pour les élèves sont réservées aux ADMINS dans ce contexte
router.use(authenticate);
router.use(requireRole(["ADMIN"]));

router.get("/", getStudents);
router.post("/", createStudent);
router.get("/:id", getStudentById);
router.patch("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;

