import { z } from "zod";

export const SignupSchema = z.object({
    firstName: z.string().min(1, "The first name is required."),
    lastName: z.string().min(1, "The last name is required."),
    email: z.email("The email address is invalid."),
    password: z.string().min(6, "The password must contain at least 6 characters."),
    confirmPassword: z.string().min(6, "The password confirmation is required."),
    acceptNewsletter: z.boolean().optional().default(false),
}).refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match.",
});

export type SignupInput = z.infer<typeof SignupSchema>;