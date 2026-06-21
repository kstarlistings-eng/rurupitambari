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
  material_id: z.string().min(1, "Material ID is required").trim(),
  material_name: z.string().min(2, "Name must be at least 2 characters").trim(),
  category: MaterialCategoryEnum,
  uom: UnitOfMeasurementEnum,
});

export const MaterialAddSchema = MaterialSchema;
export const MaterialEditSchema = MaterialSchema.partial();

export const MaterialDefaultValues = {
  material_id: "",
  material_name: "",
  category: undefined as unknown as z.infer<typeof MaterialCategoryEnum>,
  uom: undefined as unknown as z.infer<typeof UnitOfMeasurementEnum>,
};

export type Material = z.infer<typeof MaterialSchema>;
export type MaterialAdd = z.infer<typeof MaterialAddSchema>;
export type MaterialEdit = z.infer<typeof MaterialEditSchema>;
