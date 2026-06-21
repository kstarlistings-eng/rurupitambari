import type { Request, Response } from "express";
import { z } from "zod";
import { login, refreshAccessToken, getMe } from "./auth.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refresh: z.string().min(1),
});

export async function loginHandler(req: Request, res: Response) {
  try {
    const input = loginSchema.parse(req.body);
    const data = await login(input);
    successResponse(res, data);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Invalid input", 400);
    }
    errorResponse(res, err.message, 401);
  }
}

export async function refreshHandler(req: Request, res: Response) {
  try {
    const { refresh } = refreshSchema.parse(req.body);
    const data = await refreshAccessToken(refresh);
    successResponse(res, data);
  } catch (err: any) {
    errorResponse(res, err.message || "Invalid refresh token", 401);
  }
}

export async function meHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await getMe(req.user!.userId);
    successResponse(res, user);
  } catch (err: any) {
    errorResponse(res, err.message, 401);
  }
}
