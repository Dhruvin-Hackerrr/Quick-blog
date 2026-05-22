import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";
import type { UserRole } from "@prisma/client";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        throw new ApiError(400, "User not found");
      }

      if (!allowedRoles.includes(req.user?.role)) {
        throw new ApiError(403, "Forbidden, Only Authors access this services");
      }
      
      next();
    } catch (error) {
      logger.error(`Error ${error}`);
      next(error);
    }
  };
};
