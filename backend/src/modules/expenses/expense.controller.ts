import type { Response } from "express";
import { z } from "zod";
import { listExpenses, createExpense, getExpenseById, updateExpense, deleteExpense } from "./expense.service.js";
import { successResponse, errorResponse, paginatedResponse } from "../../utils/response.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";

const expenseSchema = z.object({
  raw_material_id: z.string().uuid(),
  quantity: z.number().positive(),
  unit_price: z.number().positive(),
  total_cost: z.number().positive().optional(),
  supplier_name: z.string().min(1),
  supplier_contact: z.string().optional(),
  supplier_address: z.string().optional(),
  invoice_reference: z.string().optional(),
  purchase_date: z.string().min(1),
});

export async function listExpensesHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const { count, results, limit, offset } = await listExpenses(req.query);
    paginatedResponse(res, results, count, limit, offset);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function createExpenseHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const data = expenseSchema.parse(req.body);
    const expense = await createExpense(data, req.user!.userId);
    successResponse(res, expense, 201);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    errorResponse(res, err.message, 400);
  }
}

export async function getExpenseHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const expense = await getExpenseById(req.params.id);
    if (!expense) return errorResponse(res, "Expense not found", 404);
    successResponse(res, expense);
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}

export async function updateExpenseHandler(req: AuthenticatedRequest, res: Response) {
  try {
    const data = expenseSchema.partial().parse(req.body);
    const allowed: Partial<{
      supplier_name: string;
      supplier_contact: string;
      supplier_address: string;
      invoice_reference: string;
    }> = {
      supplier_name: data.supplier_name,
      supplier_contact: data.supplier_contact,
      supplier_address: data.supplier_address,
      invoice_reference: data.invoice_reference,
    };
    const expense = await updateExpense(req.params.id, allowed);
    if (!expense) return errorResponse(res, "Expense not found", 404);
    successResponse(res, expense);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, "Validation failed", 400);
    }
    errorResponse(res, err.message);
  }
}

export async function deleteExpenseHandler(req: AuthenticatedRequest, res: Response) {
  try {
    await deleteExpense(req.params.id);
    successResponse(res, { deleted: true });
  } catch (err: any) {
    errorResponse(res, err.message);
  }
}
