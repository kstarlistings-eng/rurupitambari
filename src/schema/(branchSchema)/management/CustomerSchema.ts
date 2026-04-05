import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";

export const CustomerBaseSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),

  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),

  phone_number: z
    .string()
    .min(1, "Phone number is required!")
    .refine((val) => {
      // parse the phone number
      const phoneNumber = parsePhoneNumberFromString(val);
      // check if it's a valid number
      return phoneNumber?.isValid() ?? false;
    }, "Invalid phone number"),

  email: z
    .email({ message: "Invalid email address" })
    .optional()
    .nullable()
    .or(z.literal("")),

  gender: z.enum(["male", "female", "other"]).optional(),

  date_of_birth: z.string().optional().or(z.literal("")),

  address: z
    .string()
    .max(255, "Address must be 255 characters or less")
    .optional()
    .or(z.literal("")),

  note: z
    .string()
    .max(500, "Note must be 500 characters or less")
    .optional()
    .or(z.literal("")),
});

export const CustomerAddFormSchema = CustomerBaseSchema.transform((data) => ({
  ...data,
  email: data.email ? data.email.toLowerCase().trim() : undefined,
  phone_number: data.phone_number.trim(),
}));

export const CustomerEditFormSchema = CustomerBaseSchema.partial()
  .extend({
    first_name: CustomerBaseSchema.shape.first_name.optional(),
    last_name: CustomerBaseSchema.shape.last_name.optional(),
    phone_number: CustomerBaseSchema.shape.phone_number.optional(),
  })
  .transform((data) => ({
    ...data,
    email: data.email ? data.email.toLowerCase().trim() : undefined,
    phone_number: data.phone_number ? data.phone_number.trim() : undefined,
  }));

type CustomerBaseSchemaType = z.infer<typeof CustomerBaseSchema>;
export type CustomerAddFormSchemaType = z.infer<typeof CustomerAddFormSchema>;
export type CustomerEditFormSchemaType = z.infer<typeof CustomerEditFormSchema>;

export const CustomerDefaultValues: CustomerBaseSchemaType = {
  first_name: "",
  last_name: "",
  phone_number: "",
  email: "",
};
