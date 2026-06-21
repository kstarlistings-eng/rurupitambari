import type { Response } from "express";
import { z } from "zod";
import {
  listSellers,
  getSellerById,
  createSeller,
  updateSeller,
  deleteSeller,
} from "./seller.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

const sellerSchema = z.object({
  name: z.string().min(1),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  tax_id: z.string().optional(),
  tier: z.string().min(1),
});

export async function listSellersHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const { count, results, limit, offset } = await listSellers(req.query);
    paginatedResponse(res, results, count, limit, offset);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function getSellerHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const seller = await getSellerById(req.params.id);
    if (!seller) return errorResponse(res, "Seller not found", 404);
    successResponse(res, seller);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function createSellerHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const data = sellerSchema.parse(req.body);
    const seller = await createSeller(data);
    successResponse(res, seller, 201);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    errorResponse(res, err.message, 400);
  }
}

export async function updateSellerHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const data = sellerSchema.partial().parse(req.body);
    const seller = await updateSeller(req.params.id, data);
    if (!seller) return errorResponse(res, "Seller not found", 404);
    successResponse(res, seller);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    errorResponse(res, err.message, 400);
  }
}

export async function deleteSellerHandler(req: AuthenticatedRequest, res: Response) {
  try {
    await deleteSeller(req.params.id);
    successResponse(res, { deleted: true });
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}
