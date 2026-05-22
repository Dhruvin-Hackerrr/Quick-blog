import type { Request } from "express";
import type { AuthUser } from "../types/express.js";
import { ApiError } from "./ApiError.js";

export function requireUser (req: Request) : asserts req is Request & {user : AuthUser}  {
    if(!req.user) {
        throw new ApiError(400, "User not found")
    }
}