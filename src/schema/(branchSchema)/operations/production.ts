import { z } from "zod";

const ShiftEnum = z.enum(["Morning", "Afternoon", "Night"]);

export const ProductionOrderSchema = z.object({
  // Production Order ID / Batch Number
  // Using .toUpperCase() transformation ensures consistency in your DB
  batchNumber: z
    .string()
    .min(1, "Batch number is required")
    .trim()
    .toUpperCase(),

  // Production Date
  productionDate: z.coerce.date({
    error: () => ({ message: "Invalid production date" }),
  }),

  // Shift
  shift: ShiftEnum,

  // Supervisor Name
  supervisorName: z
    .string()
    .min(2, "Supervisor name must be at least 2 characters")
    .trim(),

  // Machine / Line Number
  // Kept as string to allow for identifiers like "Line-01" or "Machine A"
  machineLineNumber: z
    .string()
    .min(1, "Machine or Line number is required")
    .trim(),
});

export type ProductionOrder = z.infer<typeof ProductionOrderSchema>;