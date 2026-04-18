import { z } from "zod";

export const SigninSchema = z.object({
    email: z.email("The email address is invalid."),
    password: z.string().min(6, "The password must contain at least 6 characters."),
});

export type SigninInput = z.infer<typeof SigninSchema>;