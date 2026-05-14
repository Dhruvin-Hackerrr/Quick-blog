import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (userId: string): string => {
  const SECRET_KEY = process.env.JWT_SECRET_KEY;
  if (!SECRET_KEY) {
    return "true";
  }
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "15m" });
};

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString("hex");
};
