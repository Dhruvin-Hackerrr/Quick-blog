import { prisma } from "../../config/database.js";
import { hashPassword, hashToken } from "../../utils/hash.utils.js";
import logger from "../../utils/logger.js";
import { REFRESH_TOKEN_EXPIRY } from "./auth.constants.js";
import type { extendedLoginType, registerType } from "./auth.validations.js";

//  ------------------------------------ User Table Queries -----------------------------------------

export const findUserByEmail = async (email: string) => {
  const result = await prisma.user.findFirst({
    where: { email: email, isDeleted: false, isActive: true },
  });

  return result;
};

export const findUserById = async (id: string) => {
  const result = await prisma.user.findFirst({
    where: { userId: id, isDeleted: false, isActive: true },
  });

  return result;
};

export const userRegisterService = async (data: registerType) => {
  const hashedPassword = await hashPassword(data.password);
  const result = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: hashedPassword,
      role: data.role,
    },
  });

  return result;
};

export const userLoginService = async (data: extendedLoginType) => {
  const result = await prisma.user.update({
    where: { email: data.email },
    data: {
      lastLoginAt: new Date(),
    },
  });

  const hashedRefreshToken = hashToken(data.refreshToken);

  const authSession = await prisma.authSession.create({
    data: {
      userId: data.userId,
      refreshTokenHash: hashedRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    },
  });

  return { result, authSession };
};

//  ------------------------------------ Auth-session Table Queries -----------------------------------------

export const findAuthSessionByUserId = async (id: string) => {
  const result = await prisma.authSession.findFirst({
    where: { userId: id, isRevoked: false, expiresAt: { gt: new Date() } },
  });

  return result;
};

export const removeSession = async (token: string) => {
  const hashedRefreshToken = hashToken(token);

  const result = await prisma.authSession.deleteMany({
    where: {
      refreshTokenHash: hashedRefreshToken,
    },
  });

  return result;
};

export const findSessionByToken = async (token: string) => {
  const hashedRefreshToken = hashToken(token);

  const result = await prisma.authSession.findFirst({
    where: {
      refreshTokenHash: hashedRefreshToken,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
  });

  return result;
};

export const updateSession = async (
  token: string,
  oldToken: string,
  userId: string,
  id: string
) => {
  const hashedRefreshToken = hashToken(token);
  const oldRefreshToken = hashToken(oldToken);

  const result = await prisma.authSession.updateMany({
    where: {
      id: id,
      isRevoked: false,
      refreshTokenHash: oldRefreshToken,
      userId: userId,
      expiresAt: { gt: new Date() },
    },
    data: {
      refreshTokenHash: hashedRefreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    },
  });

  return result;
};

//  ------------------------------------ BlacklistToken Table Queries -----------------------------------------

export const blackListToken = async (token: string, id: string) => {
  const result = await prisma.tokenBlacklist.create({
    data: {
      userId: id,
      tokenHash: token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  return result;
};
export const findBlackListedToken = async (token: string) => {
  const result = await prisma.tokenBlacklist.findFirst({
    where: { tokenHash: token, expiresAt: { gt: new Date() } },
  });

  return result;
};
