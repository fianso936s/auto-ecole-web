import { Router } from "express";
import multer from "multer";
import { uploadDocument, getDocuments, updateDocumentStatus } from "../controllers/document.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getDocuments);
router.patch("/:id/status", authorize(["ADMIN"]), updateDocumentStatus);

export default router;

