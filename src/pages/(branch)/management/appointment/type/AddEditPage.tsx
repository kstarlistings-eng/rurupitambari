import { Page } from "@/components/layout/page/PageLayout";
import AddEditTop from "./components/AddEditTop";
import AppointmentForm from "./components/Appointment";
import { useLocation, useParams } from "react-router";
import { useRef } from "react";
import { branchEndpoints } from "@/config/endpoints";
import type { AppointmentAddFormSchemaType } from "@/schema/(branchSchema)/management/AppointmentSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authInstance } from "@/config/axios-interceptor";
import { notify } from "@/components/toast/NotifyToast";
import { appointmentKeys } from "@/config/querykeys/(branchKeys)/managementKeys";

function AddEditPage() {
  const { type } = useParams();
  const formRef1 = useRef<{ getValues: () => any; isValid: () => void; reset: () => void }>(null);
  const location = useLocation();
  const queryClient = useQueryClient();
  const { appointmentId } = location.state || {};
  console.log("this is the appointment id", appointmentId);
  console.log("type of appointment:",type);

    const addAppointmentMutation = useMutation({
    mutationFn: async (formData: AppointmentAddFormSchemaType) => {
      return await authInstance[(type === "edit" ? "patch" : "post")](
        `${branchEndpoints.APPOINTMENT}${type === "edit" ? appointmentId + "/" : ""}`,
        formData,
      );
    },
    onSuccess: () => {
      notify({
        title: "Appointment Added",
        message: "The Appointment has been added successfully.",
        variant: "success",
      });
      formRef1.current?.reset();
      queryClient.invalidateQueries({ queryKey: [appointmentKeys.ALL_APPOINTMENTS] });
    },
    onError: (error) => {
      notify({
        title: "Error Adding Appointment",
        message:
          error?.message ||
          "There was an error adding the Appointment. Please try again.",
        variant: "error",
      });
    },
  });
  
const handleSave = async () => {
    const form1Valid = await formRef1.current?.isValid();
    if (form1Valid) {
      const formData = formRef1.current?.getValues();
      console.log("Form Data before mutation:", formData);

      let modifiedFormData: AppointmentAddFormSchemaType;

      if (formData?.customer_id) {
        const { new_customer_first_name, new_customer_last_name, phone_number, ...rest } = formData;
        modifiedFormData = rest as AppointmentAddFormSchemaType;
      } else {
        const { customer_id, ...rest } = formData;
        modifiedFormData = {...rest, new_customer_phone: rest.phone_number} as AppointmentAddFormSchemaType;
      }

      console.log("Form Data after mutation:", modifiedFormData);
      addAppointmentMutation.mutate(modifiedFormData);
    } else {
      console.log("Form is not valid");
    }
  };

  return (
    <Page>
      <Page.FormContainer className="flex-col flex gap-15">
        <Page.Header>
          <AddEditTop type={type} onCancel={() => {}} onSave={handleSave} isPending={false} />
        </Page.Header>
        <Page.Content>
          <AppointmentForm ref={formRef1} editmode={type === "edit"} slug={appointmentId} />
        </Page.Content>
      </Page.FormContainer>
    </Page>
  );
}

export default AddEditPage;
