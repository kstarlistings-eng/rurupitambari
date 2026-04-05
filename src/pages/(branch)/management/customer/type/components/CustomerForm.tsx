import CustomDatePicker from "@/components/form/CustomDateField";
import CustomInputField from "@/components/form/CustomInputField";
import CustomPhoneField from "@/components/form/CustomPhoneField";
import CustomSelectField from "@/components/form/CustomSelectField";
import { Form } from "@/components/ui/form";
import useCustomerFormActions from "../useCustomerFormActions";

type Props = {
  form: ReturnType<typeof useCustomerFormActions>["form"];
};

function CustomerForm({ form }: Props) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="first_name"
            labelValue="First Name"
            placeholder="Enter first name"
            required
          />
          <CustomInputField
            nameValue="last_name"
            labelValue="Last Name"
            placeholder="Enter last name"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomPhoneField
            nameValue="phone_number"
            labelValue="Phone No."
            required
          />
          <CustomInputField
            nameValue="email"
            labelValue="Email(Optional)"
            placeholder="e.g. abc@example.com"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomSelectField
            nameValue="gender"
            labelValue="Gender"
            placeholder="Select Gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
          <CustomDatePicker
            nameValue="date_of_birth"
            labelValue="Date of Birth"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="address"
            labelValue="Address"
            placeholder="Enter address"
          />
          <CustomInputField
            nameValue="note"
            labelValue="Note"
            placeholder="Enter note"
          />
        </div>
      </div>
    </Form>
  );
}

export default CustomerForm;
