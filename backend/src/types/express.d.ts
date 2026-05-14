import type { JwtPayload } from "jsonwebtoken";
import type { User } from "../modules/auth/auth.types.ts";

interface AuhtUser extends JwtPayload {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuhtUser;
      accessToken?: string | JwtPayload;
    }
  }
}

export {};
