import { z } from "zod";

export const SigninSchema = z.object({
    email: z.email("L'adresse e-mail n'est pas valide."),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

export type SigninInput = z.infer<typeof SigninSchema>;