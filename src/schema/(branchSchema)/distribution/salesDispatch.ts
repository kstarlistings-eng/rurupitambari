import { z } from "zod";

export const SalesDispatchSchema = z.object({
  seller_id: z.string().uuid("Select a seller"),
  finished_good_id: z.string().uuid("Select a finished good"),
  quantity_allocated: z.number().positive("Quantity must be greater than 0"),
  selling_price_per_unit: z.number().positive("Price must be greater than 0"),
  order_date: z.string().min(1, "Order date is required"),
  batch_number: z.string().min(1, "Batch number is required").trim(),
});

export const SalesDispatchDefaultValues = {
  seller_id: "",
  finished_good_id: "",
  quantity_allocated: 0,
  selling_price_per_unit: 0,
  order_date: undefined as unknown as string,
  batch_number: "",
};

export type SalesDispatch = z.infer<typeof SalesDispatchSchema>;
