import { z } from "zod";

const MaterialCategoryEnum = z.enum([
  "Chemical",
  "Abrasive",
  "Additive",
  "Packaging"
]);

const UnitOfMeasurementEnum = z.enum([
  "kg", 
  "litre", 
  "gram", 
  "unit"
]);

export const MaterialSchema = z.object({
  // Material ID/Code: Assuming it shouldn't be empty
  material_id: z.string().min(1, "Material ID is required").trim(),

  // Material Name: Standard string validation
  material_name: z.string().min(2, "Name must be at least 2 characters").trim(),

  // Material Category: Validates against our specific list
  category: MaterialCategoryEnum,

  // Unit of Measurement: Ensures consistency across the DB
  uom: UnitOfMeasurementEnum,

  purchase_date: z.coerce.date({
    error: () => ({ message: "Please enter a valid date" })
  }).refine((date) => date <= new Date(), {
    message: "Purchase date cannot be in the future",
  }),
});

// Extract the TypeScript type from the schema
export type Material = z.infer<typeof MaterialSchema>;