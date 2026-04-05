import { z } from "zod";

export const AppointmentBaseSchema = z.object({
  new_customer_first_name: z.string().max(50, "First name must be 50 characters or less").optional().or(z.literal("")),
  new_customer_last_name: z.string().max(50, "Last name must be 50 characters or less").optional().or(z.literal("")),
  phone_number: z.string().max(15, "Phone number must be 15 characters or less").optional().or(z.literal("")),
  customer_id: z.string().optional(),

  appointment_services: z
    .array(
      z.object({
        service_id: z.coerce.string({ error: "Service is required",
       }).min(1, "Service is required"),

        staff_id: z.string().optional(),
      })
        )
    .min(1, "At least one service is required")
    .transform((services) =>
      services.map((s) => ({
        ...s,
        staff_id: s.staff_id === undefined ? undefined : s.staff_id,
      }))
    ),

  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  status: z.enum(["scheduled", "completed", "cancelled", "no-show"]).default("scheduled").optional(),
  note: z.string().max(500, "Note must be 500 characters or less").optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  // If no existing customer selected, require new customer fields
  if (!data.customer_id) {
    if (!data.new_customer_first_name?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "First name is required",
        path: ["new_customer_first_name"],
      });
    }
    if (!data.new_customer_last_name?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Last name is required",
        path: ["new_customer_last_name"],
      });
    }
    if (!data.phone_number?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Phone number is required",
        path: ["new_customer_phone"],
      });
    }
  }
});

export const AppointmentAddFormSchema = AppointmentBaseSchema.transform((data) => ({
  ...data,
  new_customer_phone: data.phone_number?.trim(),
}));


type AppointmentBaseSchemaType = z.infer<typeof AppointmentBaseSchema>;
export type AppointmentAddFormSchemaType = z.infer<typeof AppointmentAddFormSchema>;

export const AppointmentDefaultValues: AppointmentBaseSchemaType = {
  new_customer_first_name: "",
  new_customer_last_name: "",
  phone_number: "",
  customer_id: "",
  appointment_services: [{ service_id: "", staff_id: "" }],
  date: "",
  time: "",
  status: "scheduled",
  note: "",
};