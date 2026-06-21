import type { Response } from "express";
import { listInvoices, getInvoiceById } from "./invoice.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

export async function listInvoicesHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const { count, results, limit, offset } = await listInvoices(req.query);
    paginatedResponse(res, results, count, limit, offset);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function getInvoiceHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const invoice = await getInvoiceById(req.params.id);
    if (!invoice) return errorResponse(res, "Invoice not found", 404);
    successResponse(res, invoice);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}
