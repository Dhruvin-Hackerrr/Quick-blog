import * as z from "zod";

export const registerUserData = z
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
    role : z.enum(["AUTHOR", "READER"])
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type registerType = z.infer<typeof registerUserData>;

export const loginUserData = z.object({
  email: z.string().email("Invalid Email Format"),
  password: z
    .string()
    .min(8, "Password must contain atleast 8 characters")
    .max(16, "Password must contain atmost 16 characters"),
});

export type loginType = z.infer<typeof loginUserData>;
export type extendedLoginType = Omit<loginType, "password"> & {
    userId : string
    refreshToken : string
}