import { z } from "zod";

export const ServiceBaseSchema = z.object({
  name: z
    .string()
    .min(1, "Service name is required")
    .max(100, "Service name must be 100 characters or less"),

  category_id: z
    .number({ error: "Service category is required" })
    .min(1, "Invalid service category"),

  price: z.coerce
    .number({ error: "Price must be a number" })
    .min(0, "Price must be 0 or more"),

  duration: z.coerce
    .number({ error: "Duration must be a number" })
    .min(1, "Duration must be at least 1 minute")
    .max(1440, "Duration must be 1440 minutes (24 hours) or less"),

  description: z
    .string()
    .max(240, "Description must be 240 characters or less")
    .optional()
    .or(z.literal("")),
});

export const ServiceAddFormSchema = ServiceBaseSchema.transform((data) => ({
  ...data,
  service_name: data.name.trim(),
  description: data.description ? data.description.trim() : undefined,
}));

export const ServiceEditFormSchema = ServiceBaseSchema.partial()
  .extend({
    service_name: ServiceBaseSchema.shape.name.optional(),
    service_category: ServiceBaseSchema.shape.category_id.optional(),
    price: ServiceBaseSchema.shape.price.optional(),
    duration: ServiceBaseSchema.shape.duration.optional(),
  })
  .transform((data) => ({
    ...data,
    service_name: data.service_name ? data.service_name.trim() : undefined,
    description: data.description ? data.description.trim() : undefined,
  }));

type ServiceBaseSchemaType = z.infer<typeof ServiceBaseSchema>;
export type ServiceAddFormSchemaType = z.infer<typeof ServiceAddFormSchema>;
export type ServiceEditFormSchemaType = z.infer<typeof ServiceEditFormSchema>;

export const ServiceDefaultValues: ServiceBaseSchemaType = {
  name: "",
  category_id: undefined as any,
  price: 0,
  duration: 0,
  description: "",
};
