import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.js";
import { errorResponse } from "../utils/response.js";

export type Role = "admin_finance" | "production_operator" | "store_operator";

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401);
    }
    if (!allowedRoles.includes(req.user.role as Role)) {
      return errorResponse(res, "Forbidden", 403);
    }
    next();
  };
}
