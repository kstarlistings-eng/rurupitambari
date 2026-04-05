import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";

export const StaffBaseSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),

  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),

  phone: z
    .string()
    .min(1, "Phone number is required!")
    .refine((val) => {
      const phoneNumber = parsePhoneNumberFromString(val);
      return phoneNumber?.isValid() ?? false;
    }, "Invalid phone number"),

  email: z
    .email({ message: "Invalid email address" })
    .optional()
    .nullable()
    .or(z.literal("")),

  specialization: z
    .string()
    .max(100, "Specialization must be 100 characters or less")
    .optional()
    .or(z.literal("")),

  joined_date: z.string().min(1, "Joined date is required"),
});

export const StaffAddFormSchema = StaffBaseSchema.transform((data) => ({
  ...data,
  email: data.email ? data.email.toLowerCase().trim() : undefined,
  phone: data.phone.trim(),
}));

export const StaffEditFormSchema = StaffBaseSchema.partial()
  .extend({
    first_name: StaffBaseSchema.shape.first_name.optional(),
    last_name: StaffBaseSchema.shape.last_name.optional(),
    phone: StaffBaseSchema.shape.phone.optional(),
    joined_date: StaffBaseSchema.shape.joined_date.optional(),
  })
  .transform((data) => ({
    ...data,
    email: data.email ? data.email.toLowerCase().trim() : undefined,
    phone: data.phone ? data.phone.trim() : undefined,
  }));

type StaffBaseSchemaType = z.infer<typeof StaffBaseSchema>;
export type StaffAddFormSchemaType = z.infer<typeof StaffAddFormSchema>;
export type StaffEditFormSchemaType = z.infer<typeof StaffEditFormSchema>;

export const StaffDefaultValues: StaffBaseSchemaType = {
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  specialization: "",
  joined_date: "",
};
