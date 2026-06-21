import type { Request, Response } from "express";
import { z } from "zod";
import {
  listRawMaterials,
  getRawMaterialById,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  bulkDeleteRawMaterials,
} from "./raw-material.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

const materialSchema = z.object({
  material_id: z.string().min(1),
  material_name: z.string().min(2),
  category: z.string().min(1),
  uom: z.string().min(1),
});

export async function listRawMaterialsHandler(req: Request, res: Response) {
  try {
    const { count, results, limit, offset } = await listRawMaterials(req.query);
    paginatedResponse(res, results, count, limit, offset);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function getRawMaterialHandler(req: Request, res: Response) {
  try {
    const material = await getRawMaterialById(req.params.id);
    if (!material) return errorResponse(res, "Raw material not found", 404);
    successResponse(res, material);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function createRawMaterialHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const data = materialSchema.parse(req.body);
    const material = await createRawMaterial(data);
    successResponse(res, material, 201);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    if (err.code === "23505") {
      return errorResponse(res, "Material ID already exists", 400);
    }
    errorResponse(res, err.message);
  }
}

export async function updateRawMaterialHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const data = materialSchema.partial().parse(req.body);
    const material = await updateRawMaterial(req.params.id, data);
    if (!material) return errorResponse(res, "Raw material not found", 404);
    successResponse(res, material);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    if (err.code === "23505") {
      return errorResponse(res, "Material ID already exists", 400);
    }
    errorResponse(res, err.message);
  }
}

export async function deleteRawMaterialHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    await deleteRawMaterial(req.params.id);
    successResponse(res, { deleted: true });
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function bulkDeleteRawMaterialsHandler(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const ids = z.array(z.string().uuid()).parse(req.body.object_ids);
    await bulkDeleteRawMaterials(ids);
    successResponse(res, { deleted: true });
  } catch (err: any) {
    errorResponse(res, err.message, 400);
  }
}
