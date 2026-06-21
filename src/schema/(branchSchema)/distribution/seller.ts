import { z } from "zod";

export const SellerSchema = z.object({
  name: z.string().min(1, "Seller name is required").trim(),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional(),
  tax_id: z.string().optional(),
  tier: z.string().min(1, "Dealer tier is required"),
});

export const SellerDefaultValues = {
  name: "",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
  tax_id: "",
  tier: "",
};

export type Seller = z.infer<typeof SellerSchema>;
