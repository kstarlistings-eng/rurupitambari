import type { Response } from "express";
import { listFinishedGoods, getFinishedGoodById } from "./finished-good.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

export async function listFinishedGoodsHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const { count, results, limit, offset } = await listFinishedGoods(req.query);
    paginatedResponse(res, results, count, limit, offset);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function getFinishedGoodHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const item = await getFinishedGoodById(req.params.id);
    if (!item) return errorResponse(res, "Finished good not found", 404);
    successResponse(res, item);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}
