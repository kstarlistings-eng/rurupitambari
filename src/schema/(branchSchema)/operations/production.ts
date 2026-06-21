import { z } from "zod";

const ShiftEnum = z.enum(["Morning", "Afternoon", "Night"]);

const ConsumptionSchema = z.object({
  raw_material_id: z.string().uuid("Select a raw material"),
  quantity_consumed: z.number().positive("Consumed quantity must be greater than 0"),
});

export const ProductionOrderSchema = z.object({
  batchNumber: z
    .string()
    .min(1, "Batch number is required")
    .trim()
    .toUpperCase(),
  productName: z.string().min(1, "Product name is required").trim(),
  quantityProduced: z.number().positive("Quantity produced must be greater than 0"),
  productionDate: z.string().min(1, "Production date is required"),
  shift: ShiftEnum,
  supervisorName: z
    .string()
    .min(2, "Supervisor name must be at least 2 characters")
    .trim(),
  machineLineNumber: z
    .string()
    .min(1, "Machine or Line number is required")
    .trim(),
  consumptions: z.array(ConsumptionSchema).min(1, "At least one raw material is required"),
});

export const ProductionOrderDefaultValues = {
  batchNumber: "",
  productName: "",
  quantityProduced: 0,
  productionDate: undefined as unknown as string,
  shift: undefined as unknown as z.infer<typeof ShiftEnum>,
  supervisorName: "",
  machineLineNumber: "",
  consumptions: [{ raw_material_id: "", quantity_consumed: 0 }],
};

export type ProductionOrder = z.infer<typeof ProductionOrderSchema>;
export type ProductionConsumption = z.infer<typeof ConsumptionSchema>;
