import { z } from "zod";

export const ExpenseSchema = z.object({
  raw_material_id: z.string().uuid("Select a raw material"),
  quantity: z.number().positive("Quantity must be greater than 0"),
  unit_price: z.number().positive("Unit price must be greater than 0"),
  total_cost: z.number().positive("Total cost must be greater than 0").optional(),
  supplier_name: z.string().min(1, "Supplier name is required").trim(),
  supplier_contact: z.string().optional(),
  supplier_address: z.string().optional(),
  invoice_reference: z.string().optional(),
  purchase_date: z.string().min(1, "Purchase date is required"),
});

export const ExpenseDefaultValues = {
  raw_material_id: "",
  quantity: 0,
  unit_price: 0,
  total_cost: undefined as number | undefined,
  supplier_name: "",
  supplier_contact: "",
  supplier_address: "",
  invoice_reference: "",
  purchase_date: undefined as unknown as string,
};

export type Expense = z.infer<typeof ExpenseSchema>;
