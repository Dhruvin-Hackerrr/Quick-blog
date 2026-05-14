import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        throw new ApiError(400, "User not found");
      }

      if (!allowedRoles.includes(req.user?.role)) {
        throw new ApiError(403, "Forbidden");
      }

      next();
    } catch (error) {
      logger.error(`Error ${error}`);
      next(error);
    }
  };
};
