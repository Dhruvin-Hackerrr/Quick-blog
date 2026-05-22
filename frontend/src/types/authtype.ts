import z from "zod";
import type { loginSchema, registerSchema } from "../validations/authSchema";

export type loginFormData = z.infer<typeof loginSchema>;

export type registerFormData = z.infer<typeof registerSchema>;

export enum Role {
    AUTHOR = "AUTHOR",
    READER = "READER"
}