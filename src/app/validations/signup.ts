import { z } from "zod";

export const SignupSchema = z.object({
    firstName: z.string().min(1, "Le prénom est requis."),
    lastName: z.string().min(1, "Le nom de famille est requis."),
    email: z.email("L'adresse e-mail n'est pas valide."),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
    confirmPassword: z.string().min(6, "La confirmation du mot de passe est requise."),
    acceptNewsletter: z.boolean().optional().default(false),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
});

export type SignupInput = z.infer<typeof SignupSchema>;