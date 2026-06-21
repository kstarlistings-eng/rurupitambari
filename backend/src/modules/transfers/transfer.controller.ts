import type { Response } from "express";
import { listTransfers, getTransferById, receiveTransfer } from "./transfer.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

export async function listTransfersHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const { count, results, limit, offset } = await listTransfers(req.query);
    paginatedResponse(res, results, count, limit, offset);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function getTransferHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const transfer = await getTransferById(req.params.id);
    if (!transfer) return errorResponse(res, "Transfer not found", 404);
    successResponse(res, transfer);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function receiveTransferHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const transfer = await receiveTransfer(req.params.id, req.user!.userId);
    successResponse(res, transfer);
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}
