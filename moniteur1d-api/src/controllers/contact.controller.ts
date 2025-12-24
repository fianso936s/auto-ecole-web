import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";

const contactSchema = z.object({
  firstName: z.string().min(2, "Le prénom est trop court"),
  lastName: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Le message doit faire au moins 10 caractères"),
  website: z.string().optional(), // Honeypot field
});

export const submitContact = async (req: Request, res: Response) => {
  try {
    const validatedData = contactSchema.parse(req.body);

    // Simple honeypot check: if 'website' field is filled, it's likely a bot
    if (validatedData.website) {
      return res.status(400).json({ message: "Spam détecté" });
    }

    const lead = await prisma.lead.upsert({
      where: { email: validatedData.email },
      update: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        message: validatedData.message,
        status: "NEW",
        updatedAt: new Date(),
      },
      create: {
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone,
        message: validatedData.message,
        source: "website",
        status: "NEW",
      },
    });

    res.status(201).json({ message: "Votre message a été envoyé avec succès" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: "Une erreur est survenue lors de l'envoi du message" });
  }
};

