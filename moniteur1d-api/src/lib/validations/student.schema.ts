import { z } from "zod";

export const studentSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email requis" }).email("Email invalide"),
    password: z.string({ required_error: "Mot de passe requis" }).min(8, "8 caractères minimum"),
    firstName: z.string({ required_error: "Prénom requis" }).min(2),
    lastName: z.string({ required_error: "Nom requis" }).min(2),
    phone: z.string({ required_error: "Téléphone requis" }),
    city: z.string({ required_error: "Ville requise" }),
    birthDate: z.string().optional(),
    address: z.string().optional(),
    postalCode: z.string().optional(),
    cpfEligible: z.boolean().optional(),
  }),
});

export const updateStudentSchema = studentSchema.partial();

