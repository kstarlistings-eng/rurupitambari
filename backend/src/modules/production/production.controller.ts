import type { Response } from "express";
import { z } from "zod";
import {
  listProductionOrders,
  getProductionOrderById,
  createProductionOrder,
  updateProductionOrder,
  deleteProductionOrder,
} from "./production.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

const consumptionSchema = z.object({
  raw_material_id: z.string().uuid(),
  quantity_consumed: z.number().positive(),
});

const productionOrderSchema = z.object({
  batch_number: z.string().min(1),
  product_name: z.string().min(1),
  quantity_produced: z.number().positive(),
  production_date: z.string().min(1),
  shift: z.string().min(1),
  supervisor_name: z.string().min(2),
  machine_line_number: z.string().min(1),
  consumptions: z.array(consumptionSchema).min(1),
});

export async function listProductionOrdersHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { count, results, limit, offset } = await listProductionOrders(req.query);
    paginatedResponse(res, results, count, limit, offset);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function getProductionOrderHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const order = await getProductionOrderById(req.params.id);
    if (!order) return errorResponse(res, "Production order not found", 404);
    successResponse(res, order);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function createProductionOrderHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const data = productionOrderSchema.parse(req.body);
    const order = await createProductionOrder(data, req.user!.userId);
    successResponse(res, order, 201);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    if (err.code === "23505") {
      return errorResponse(res, "Batch number already exists", 400);
    }
    errorResponse(res, err.message, 400);
  }
}

export async function updateProductionOrderHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const data = productionOrderSchema.partial().parse(req.body);
    const allowed: Partial<{
      product_name: string;
      supervisor_name: string;
      machine_line_number: string;
    }> = {
      product_name: data.product_name,
      supervisor_name: data.supervisor_name,
      machine_line_number: data.machine_line_number,
    };
    const order = await updateProductionOrder(req.params.id, allowed);
    if (!order) return errorResponse(res, "Production order not found", 404);
    successResponse(res, order);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    errorResponse(res, err.message);
  }
}

export async function deleteProductionOrderHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    await deleteProductionOrder(req.params.id);
    successResponse(res, { deleted: true });
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}
