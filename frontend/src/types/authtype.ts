import z from "zod";
import type { loginSchema, registerSchema } from "../validations/authSchema";

export type loginFormData = z.infer<typeof loginSchema>;

export type registerFormData = z.infer<typeof registerSchema>;

export enum Role {
  AUTHOR = "AUTHOR",
  READER = "READER",
}

export type User = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: Date | null;
};
