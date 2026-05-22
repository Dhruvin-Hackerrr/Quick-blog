import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodObject } from "zod";
import logger from "./logger.js";
import { ApiError } from "./ApiError.js";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        throw new ApiError(400, "Validation Failed", errors)
      }
      logger.error(error)
      return next(error)
    }
  };
