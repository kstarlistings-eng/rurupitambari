import type { Response } from "express";
import { z } from "zod";
import {
  listSalesDispatches,
  getSalesDispatchById,
  createSalesDispatch,
  updateSalesDispatch,
  deleteSalesDispatch,
} from "./sales-dispatch.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

const salesDispatchSchema = z.object({
  seller_id: z.string().uuid(),
  finished_good_id: z.string().uuid(),
  quantity_allocated: z.number().positive(),
  selling_price_per_unit: z.number().positive(),
  order_date: z.string().min(1),
  batch_number: z.string().min(1),
});

export async function listSalesDispatchesHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const { count, results, limit, offset } = await listSalesDispatches(req.query);
    paginatedResponse(res, results, count, limit, offset);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function getSalesDispatchHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const dispatch = await getSalesDispatchById(req.params.id);
    if (!dispatch) return errorResponse(res, "Sales dispatch not found", 404);
    successResponse(res, dispatch);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function createSalesDispatchHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const data = salesDispatchSchema.parse(req.body);
    const dispatch = await createSalesDispatch(data, req.user!.userId);
    successResponse(res, dispatch, 201);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    errorResponse(res, err.message, 400);
  }
}

export async function updateSalesDispatchHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const data = salesDispatchSchema.partial().parse(req.body);
    const allowed: Partial<{ order_date: string; batch_number: string }> = {
      order_date: data.order_date,
      batch_number: data.batch_number,
    };
    const dispatch = await updateSalesDispatch(req.params.id, allowed);
    if (!dispatch) return errorResponse(res, "Sales dispatch not found", 404);
    successResponse(res, dispatch);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    errorResponse(res, err.message);
  }
}

export async function deleteSalesDispatchHandler(req: AuthenticatedRequest, res: Response) {
  try {
    await deleteSalesDispatch(req.params.id);
    successResponse(res, { deleted: true });
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}
