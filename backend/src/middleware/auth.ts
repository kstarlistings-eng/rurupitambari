import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken, type UserPayload } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    return errorResponse(res, "Unauthorized", 401);
  }
}
