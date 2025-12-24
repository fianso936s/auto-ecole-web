import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { z } from "zod";
import bcrypt from "bcrypt";

const instructorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string(),
  licenseNumber: z.string().optional(),
  bio: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const getInstructors = async (req: Request, res: Response) => {
  try {
    const instructors = await prisma.instructorProfile.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des moniteurs" });
  }
};

export const createInstructor = async (req: Request, res: Response) => {
  try {
    const data = instructorSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const instructor = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: "INSTRUCTOR",
        instructorProfile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            licenseNumber: data.licenseNumber,
            bio: data.bio,
            isActive: data.isActive ?? true,
          }
        }
      },
      include: {
        instructorProfile: true
      }
    });

    res.status(201).json(instructor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Erreur lors de la création du moniteur" });
  }
};

export const getInstructorById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const instructor = await prisma.instructorProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      }
    });

    if (!instructor) {
      return res.status(404).json({ message: "Moniteur non trouvé" });
    }

    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du moniteur" });
  }
};

export const updateInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateSchema = instructorSchema.partial();

  try {
    const data = updateSchema.parse(req.body);
    
    const instructor = await prisma.instructorProfile.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        bio: data.bio,
        isActive: data.isActive,
      },
    });

    res.json(instructor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Erreur lors de la mise à jour du moniteur" });
  }
};

export const toggleInstructorActive = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    const instructor = await prisma.instructorProfile.update({
      where: { id },
      data: { isActive },
    });
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du changement de statut" });
  }
};

export const deleteInstructor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const profile = await prisma.instructorProfile.findUnique({ where: { id } });
    if (!profile) return res.status(404).json({ message: "Moniteur non trouvé" });

    await prisma.user.delete({ where: { id: profile.userId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du moniteur" });
  }
};

