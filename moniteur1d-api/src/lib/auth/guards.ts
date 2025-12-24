import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.js";
import prisma from "../prisma.js";

/**
 * Middleware de base pour vérifier que l'utilisateur est authentifié
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentification requise" });
  }
  next();
};

/**
 * Vérifie que l'utilisateur a l'un des rôles autorisés
 */
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentification requise" });
    }
    
    // Bypass pour l'admin
    if (req.user.role === "ADMIN") {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé - Rôle insuffisant" });
    }
    next();
  };
};

/**
 * Vérifie que l'élève accède à ses propres données
 */
export const requireOwnershipStudent = (studentIdParamName: string = "id") => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    // Bypass admin
    if (req.user.role === "ADMIN") {
      return next();
    }

    const requestedStudentId = req.params[studentIdParamName];

    // On récupère le StudentProfile lié à l'utilisateur connecté
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!studentProfile || studentProfile.id !== requestedStudentId) {
      return res.status(403).json({ message: "Accès refusé - Vous ne pouvez accéder qu'à vos propres données" });
    }

    next();
  };
};

/**
 * Vérifie qu'un moniteur a accès aux données d'un élève (via une leçon commune)
 */
export const requireInstructorHasAccess = (studentIdParamName: string = "studentId") => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    // Bypass admin
    if (req.user.role === "ADMIN") {
      return next();
    }

    if (req.user.role !== "INSTRUCTOR") {
      return res.status(403).json({ message: "Accès réservé aux moniteurs" });
    }

    const studentId = req.params[studentIdParamName];
    
    // On récupère le InstructorProfile lié à l'utilisateur connecté
    const instructorProfile = await prisma.instructorProfile.findUnique({
      where: { userId: req.user.id }
    });

    if (!instructorProfile) {
      return res.status(403).json({ message: "Accès refusé - Profil moniteur non trouvé" });
    }

    // Vérifier si le moniteur a au moins une leçon passée, présente ou future avec cet élève
    const hasLesson = await prisma.lesson.findFirst({
      where: {
        instructorId: instructorProfile.id,
        studentId: studentId
      }
    });

    if (!hasLesson) {
      return res.status(403).json({ message: "Accès refusé - Cet élève ne vous est pas assigné" });
    }

    next();
  };
};

