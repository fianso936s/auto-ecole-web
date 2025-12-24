import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { z } from "zod";
import bcrypt from "bcrypt";

const studentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string(),
  city: z.string(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  cpfEligible: z.boolean().optional(),
});

export const getStudents = async (req: Request, res: Response) => {
  const { query, status, page = "1" } = req.query;
  const skip = (parseInt(page as string) - 1) * 10;

  try {
    const students = await prisma.studentProfile.findMany({
      where: {
        OR: query ? [
          { firstName: { contains: query as string, mode: "insensitive" } },
          { lastName: { contains: query as string, mode: "insensitive" } },
          { user: { email: { contains: query as string, mode: "insensitive" } } },
        ] : undefined,
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          }
        }
      },
      skip,
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des élèves" });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const data = studentSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const student = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: "STUDENT",
        studentProfile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            city: data.city,
            birthDate: data.birthDate ? new Date(data.birthDate) : null,
            address: data.address,
            postalCode: data.postalCode,
            cpfEligible: data.cpfEligible,
          }
        }
      },
      include: {
        studentProfile: true
      }
    });

    res.status(201).json(student);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Erreur lors de la création de l'élève" });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const student = await prisma.studentProfile.findUnique({
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

    if (!student) {
      return res.status(404).json({ message: "Élève non trouvé" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'élève" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateSchema = studentSchema.partial();

  try {
    const data = updateSchema.parse(req.body);
    
    const student = await prisma.studentProfile.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        city: data.city,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        address: data.address,
        postalCode: data.postalCode,
        cpfEligible: data.cpfEligible,
      },
    });

    res.json(student);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'élève" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Soft delete can be implemented by adding an isActive field to User or StudentProfile
    // For now, we'll just delete the user (which cascades to profile)
    const profile = await prisma.studentProfile.findUnique({ where: { id } });
    if (!profile) return res.status(404).json({ message: "Élève non trouvé" });

    await prisma.user.delete({ where: { id: profile.userId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'élève" });
  }
};

