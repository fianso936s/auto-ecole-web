import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "L'email est requis",
    }).email("Email invalide"),
    password: z.string().optional(),
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
    password: z.string().optional(),
  }),
});

