import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { authService } from "../modules/auth/index.js";
import { hashToken } from "../utils/hash.utils.js";

interface JwtPayloadWithId {
  id: string;
}

export const getAccesToken = (req: Request) => {
  const authHeader = req.header("authorization");
  if (!authHeader?.includes("Bearer ")) return null;
  return authHeader.replace("Bearer ", "");
};

export const isUserAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = getAccesToken(req);
    if (!accessToken) {
      throw new ApiError(400, "Access Token was not found");
    }

    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!SECRET_KEY) {
      throw new ApiError(400, "Does not found jwt secret key");
    }

    try {
      const hashedAccessToken = hashToken(accessToken);
      const isBlackListed = await authService.findBlackListedToken(
        hashedAccessToken
      );
      if (isBlackListed) {
        throw new ApiError(400, "Token was black listed");
      }

      const decoded = jwt.verify(accessToken, SECRET_KEY) as JwtPayloadWithId;
      const user = await authService.findUserById(decoded.id);
      if (!user) {
        throw new ApiError(400, "User not found");
      }

      const session = await authService.findAuthSessionByUserId(decoded.id);
      if (!session) {
        throw new ApiError(400, "User  Not Logged In");
      }

      req.user = user;
      req.accessToken = accessToken;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        logger.info("Access token expired");
        throw new ApiError(401, "Access token expired");
      }
    
      if (error instanceof jwt.JsonWebTokenError) {
        logger.error("Invalid token");
        throw new ApiError(401, "Invalid token");
      }
    
      logger.error(`Unexpected error: ${error}`);
      throw new ApiError(500, "Authentication failed");
    }
  }
);
