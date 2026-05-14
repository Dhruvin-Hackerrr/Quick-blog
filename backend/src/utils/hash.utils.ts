import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const hashToken = (token: string): string => {
  if (!token) return "";
  return crypto.createHash("sha256").update(token).digest("hex");
};
