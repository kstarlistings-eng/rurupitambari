import type { Response } from "express";
import { getDashboardData } from "./dashboard.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

export async function getDashboardHandler(_req: AuthenticatedRequest, res: Response) {
  try {
    const data = await getDashboardData();
    successResponse(res, data);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}
