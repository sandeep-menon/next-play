import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
});

export const signupSchema = z.object({
    email: z.email("Invalid email address").max(255, "Email must be at most 255 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be at most 50 characters"),
    password: z.string().min(3, "Password must be at least 3 characters").max(50, "Password must be at most 50 characters"),
    retypePassword: z.string().min(3, "Password must be at least 3 characters").max(50, "Password must be at most 50 characters"),
}).refine((data) => data.password === data.retypePassword, {
    message: "Passwords must match",
    path: ["retypePassword"],
});

export type LoginInput = z.infer<typeof loginSchema>
export type SignUpInput = z.infer<typeof signupSchema>