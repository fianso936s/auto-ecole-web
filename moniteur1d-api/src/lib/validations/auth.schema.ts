import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "L'email est requis",
    }).email("Email invalide"),
    password: z.string({
      required_error: "Le mot de passe est requis",
    })
    .min(8, "Le mot de passe doit faire au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    firstName: z.string({
      required_error: "Le prénom est requis",
    }).min(2, "Le prénom est trop court"),
    lastName: z.string({
      required_error: "Le nom est requis",
    }).min(2, "Le nom est trop court"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "L'email est requis",
    }).email("Email invalide"),
    password: z.string({
      required_error: "Le mot de passe est requis",
    }),
  }),
});

