import { z } from "zod";
import { Role } from "../types/authtype";

export const loginSchema = z.object({
  email: z.string().email("Invalid Email Format"),
  password: z
    .string()
    .min(8, "Password must contain atleast 8 characters")
    .max(16, "Password must contain atmost 16 characters"),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "First Name must contain atlest 3 characters")
      .max(16, "First Name must contain atmost 16 characters"),
    lastName: z
      .string()
      .min(3, "Last Name must contain atlest 3 characters")
      .max(16, "Last Name must contain atmost 16 characters"),
    email: z.string().email("Invalid Email Format"),
    password: z
      .string()
      .min(8, "Password must contain atleast 8 characters")
      .max(16, "Password must contain atmost 16 characters"),
    confirmPassword: z.string(),
    role: z.enum(Role),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });


