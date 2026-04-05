import CustomDatePicker from "@/components/form/CustomDateField";
import CustomInputField from "@/components/form/CustomInputField";
import CustomPhoneField from "@/components/form/CustomPhoneField";
import { Form } from "@/components/ui/form";
import useStaffFormActions from "../useStaffFormActions";

type Props = {
  form: ReturnType<typeof useStaffFormActions>["form"];
};

function StaffForm({ form }: Props) {

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
          <CustomPhoneField nameValue="phone" labelValue="Phone No." required />
          <CustomInputField
            nameValue="email"
            labelValue="Email"
            placeholder="e.g. abc@example.com"
            customLabel={<span className="text-gray-400"> (Optional)</span>}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="specialization"
            labelValue="Specialization"
            placeholder="Enter specialization"
            customLabel={<span className="text-gray-400"> (Optional)</span>}
          />
          <CustomDatePicker
            nameValue="joined_date"
            labelValue="Joined Date"
            required
          />
        </div>
      </div>
    </Form>
  );
}

export default StaffForm;
