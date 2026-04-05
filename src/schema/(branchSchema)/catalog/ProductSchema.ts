import { DEFAULT_CURRENCIES } from "@/components/form/CustomPriceInputField";
import { z } from "zod";

export const ProductUnitEnum = ["pcs", "kg", "liters", "packs"] as const;

export const ProductAddFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().min(1, "Barcode is required"),
  category: z.coerce.number().min(1, "Product category is required"),
  brand: z.string().min(1, "Brand name is required"),
  selling_price: z.coerce.number().min(1, "Selling price is required"),
  selling_price_currency: z.enum(
    DEFAULT_CURRENCIES.map((c) => c.code),
    {
      error:
        "Selling price currency must be one of " +
        DEFAULT_CURRENCIES.map((c) => c.code).join(", "),
    },
  ),
  cost_price: z.coerce.number().min(1, "Cost price is required"),
  cost_price_currency: z.enum(
    DEFAULT_CURRENCIES.map((c) => c.code),
    {
      error:
        "Cost price currency must be one of " +
        DEFAULT_CURRENCIES.map((c) => c.code).join(", "),
    },
  ),
  stock_quantity: z.coerce
    .number({ error: "Stock quantity is required" })
    .min(0, "Stock quantity cannot be negative"),
  low_stock_threshold: z.coerce
    .number({ error: "Low stock threshold is required" })
    .min(0, "Low stock threshold cannot be negative"),
  unit: z.enum(ProductUnitEnum, {
    error: `Unit must be one of ${ProductUnitEnum.join(", ")}`,
  }),
  batch: z.coerce.number().min(1, "Batch is required"),
  expiry_date: z
    .string()
    .min(1, "Expiry date is required")
    .refine(
      (dateString) => {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: "Expiry date cannot be in the past" },
    ),
  track_inventory: z.boolean().default(false),
  description: z
    .string()
    .max(240, { message: "Description cannot exceed 240 characters" })
    .optional()
    .default(""),
  note: z
    .string()
    .max(240, { message: "Notes cannot exceed 240 characters" })
    .optional()
    .default(""),
});

export const ProductEditFormSchema = ProductAddFormSchema.partial();

export type ProductAddFormSchemaType = z.infer<typeof ProductAddFormSchema>;
export type ProductEditFormSchemaType = z.infer<typeof ProductEditFormSchema>;

export const ProductDefaultValues: ProductAddFormSchemaType = {
  name: "",
  sku: "",
  barcode: "",
  category: 0,
  brand: "",
  selling_price: "" as any,
  selling_price_currency: DEFAULT_CURRENCIES[0].code,
  cost_price: "" as any,
  cost_price_currency: DEFAULT_CURRENCIES[0].code,
  stock_quantity: 0,
  low_stock_threshold: 0,
  unit: "pcs",
  batch: 0,
  expiry_date: "",
  track_inventory: false,
  description: "",
  note: "",
};
