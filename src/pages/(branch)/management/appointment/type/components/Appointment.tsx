import CustomDatePicker from "@/components/form/CustomDateField";
import CustomInputField from "@/components/form/CustomInputField";
import CustomSelectField from "@/components/form/CustomSelectField";
import CustomTimeField from "@/components/form/CustomTimeField";
// import { notify } from "@/components/toast/NotifyToast";
import { Form } from "@/components/ui/form";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import {
  AppointmentAddFormSchema,
  AppointmentDefaultValues,
} from "@/schema/(branchSchema)/management/AppointmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CustomerSearchField from "@/components/form/CustomSearchField";
import { useQuery } from "@tanstack/react-query";
import { Clock, Plus, Trash2 } from "lucide-react";
import { useEffect, useImperativeHandle } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation} from "react-router";
import { appointmentKeys, serviceKeys, staffKeys } from "@/config/querykeys/(branchKeys)/managementKeys";

type AddFormProps = {
  slug?: string;
  editmode?: boolean;
  ref: any,
}
function AppointmentForm({
  slug,
  editmode = false,
  ref
}: AddFormProps) {
  // const queryClient = useQueryClient();
  const location = useLocation();
  const { AppointmentId } = location.state || {};
  console.log(AppointmentId, editmode);

  const form = useForm<any>({
    defaultValues: AppointmentDefaultValues,
    resolver: zodResolver(
      AppointmentAddFormSchema
    ),
  });

  useImperativeHandle(ref, () => ({
          getValues: () => form.getValues(),
          isValid: async () => form.trigger(),
          reset: () => form.reset() 
  }));

  const {data: appointmentData, isLoading: isAppointmentLoading} = useQuery({
        queryKey: [appointmentKeys.ALL_APPOINTMENTS, slug],
        queryFn: async () => await authInstance.get(`${branchEndpoints.APPOINTMENT}${slug}`),  
        enabled: editmode
  });

  const {data: servicesData, isLoading: isServicesLoading} = useQuery({
        queryKey: [serviceKeys.ALL_SERVICES , slug],
        queryFn: async () => await authInstance.get(`${branchEndpoints.SERVICES}`).then(res => res.results),  
  });
  
  const {data: staffData, isLoading: isStaffLoading} = useQuery({
      queryKey: [staffKeys.ALL_STAFF, slug],
      queryFn: async () => await authInstance.get(`${branchEndpoints.STAFF}`).then(res => res.results),
  });
  
  console.log("this is the services data", servicesData, isServicesLoading, isStaffLoading);
  console.log("this is the staff data", staffData);
  console.log("this is the appointment data", appointmentData, isAppointmentLoading, editmode);

  const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "appointment_services",
      });

  useEffect(() => {
  if (appointmentData) {
    form.reset({
      customer_id: String(appointmentData.customer?.id),
      appointment_services: appointmentData.appointment_services?.map(
        (item: any) => ({
          service_id: String(item.service?.id),
          staff_id: String(item.staff?.id) ?? "",
        })
      ),
      date: appointmentData.date,
      time: appointmentData.time,
      status: appointmentData.status,
      note: appointmentData.note ?? "",
    });
  }
}, [appointmentData, form, servicesData, staffData,]);

  console.log("this is the form Data", form.watch());

  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-8">
          <CustomerSearchField 
            nameValue="customer_id" 
            form={form}
            defaultCustomer={
            editmode && appointmentData?.customer
              ? {
                  id: appointmentData.customer.id,
                  first_name: appointmentData.customer.full_name?.split(" ")[0] ?? "",
                  last_name: appointmentData.customer.full_name?.split(" ").slice(1).join(" ") ?? "",
                  phone_number: appointmentData.customer.phone_number ?? "",
                }
              : null
          }
          />
        </div>
       <div className="flex items-center justify-between">
          <p className="font-medium">Services & Staff Assignment</p>
          <button
            type="button"
            onClick={() => append({ service_id: "", staff_id: "" })}
            className="flex items-center gap-1 text-primary-500 font-medium"
          >
            <Plus size={16} /> Add Service
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-4 border rounded-xl p-4 relative">
            <span className="bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {index + 1}
            </span>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomSelectField
                nameValue={`appointment_services.${index}.service_id`}
                labelValue="Service"
                options={
                  (servicesData || []).map((service: any) => ({
                  label: service.name,
                  value: service.id,
                }))}
                placeholder="Select Service"
                isLoading={isServicesLoading}
                required
              />
              <CustomSelectField
                nameValue={`appointment_services.${index}.staff_id`}
                labelValue="Staff (Optional)"
                options={(staffData || []).map((staff: any) => ({
                  label: staff.full_name,
                  value: staff.id,
                }))}
                placeholder="Not Assigned"
                isLoading={isStaffLoading}
                unSelectName="Not Assigned"
              />
            </div>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 mt-8"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomDatePicker
            nameValue="date"
            labelValue="Date"
            fromDate={new Date()}
            required
          />
          <CustomTimeField
            nameValue="time"
            labelValue="Time"
            placeholder="00:00 AM"
            required
            icon={<Clock className="w-4 h-4 text-neutral-400" />}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomSelectField
            nameValue="status"
            labelValue="Status"
            placeholder="Select Status"
            options={[
              { label: "Scheduled", value: "scheduled" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ]}
          />
          <CustomInputField
            nameValue="note"
            labelValue="Note"
            placeholder="Enter note"
            className="h-10"
          />
        </div>
      </div>
    </Form>
  );
}

export default AppointmentForm;
