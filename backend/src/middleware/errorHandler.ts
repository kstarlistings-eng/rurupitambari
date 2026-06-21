import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.js";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    const details: Record<string, string> = {};
    for (const issue of err.issues) {
      const path = issue.path.join(".");
      details[path || "form"] = issue.message;
    }
    return errorResponse(res, "Validation failed", 400, details);
  }

  console.error("Unhandled error:", err);
  return errorResponse(res, err.message || "Something went wrong", 500);
}
