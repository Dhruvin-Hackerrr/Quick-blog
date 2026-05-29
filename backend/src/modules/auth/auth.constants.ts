import type { User } from "./auth.types.js";

export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const userSafe = (user: User) => {
    const {
      passwordHash,
      isDeleted,
      deletedAt,
      createdAt,
      updatedAt,
      ...safeUser
    } = user;
  
    return safeUser;
  };