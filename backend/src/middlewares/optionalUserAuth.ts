import type { NextFunction, Request, Response } from "express";
import { authService } from "../modules/auth/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashToken } from "../utils/hash.utils.js";
import { getAccesToken, type JwtPayloadWithId } from "./auth.middleware.js";
import jwt from "jsonwebtoken";

export const optionalUserAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = getAccesToken(req);

    // No token → continue as guest
    if (!accessToken) {
      return next();
    }

    const SECRET_KEY = process.env.JWT_SECRET_KEY;

    if (!SECRET_KEY) {
      return next();
    }

    try {
      const hashedAccessToken = hashToken(accessToken);

      const isBlackListed = await authService.findBlackListedToken(
        hashedAccessToken
      );

      if (isBlackListed) {
        return next();
      }

      const decoded = jwt.verify(accessToken, SECRET_KEY) as JwtPayloadWithId;

      const user = await authService.findUserById(decoded.id);

      if (!user) {
        return next();
      }

      const session = await authService.findAuthSessionByUserId(decoded.id);

      if (!session) {
        return next();
      }

      req.user = user;

      next();
    } catch {
      next();
    }
  }
);
