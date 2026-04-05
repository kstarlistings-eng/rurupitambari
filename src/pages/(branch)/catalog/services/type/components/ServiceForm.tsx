import CustomInputField from "@/components/form/CustomInputField";
import { Form } from "@/components/ui/form";
import useServiceFromActions from "../useServiceFromActions";
import { CustomSingleSelectField } from "@/components/form/CustomSingleSelectField";
import { branchEndpoints } from "@/config/endpoints";

type Props = {
  form: ReturnType<typeof useServiceFromActions>["form"];
};

function ServiceForm({ form }: Props) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="name"
            labelValue="Service Name"
            placeholder="Enter service name"
            required
          />
          <CustomSingleSelectField
            nameValue="category_id"
            labelValue="Service Category"
            placeholder="Enter service category"
            categoryEndpoint={branchEndpoints.SERVICE_CATEGORIES}
            LIMIT={8}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="price"
            labelValue="Price (NRs.)"
            placeholder="Enter price"
            type="number"
            required
          />
          <CustomInputField
            nameValue="duration"
            labelValue="Duration (min)"
            placeholder="Enter duration"
            type="number"
            required
          />
        </div>
        <CustomInputField
          nameValue="description"
          labelValue="Description (240 characters)"
          placeholder="Enter description"
          type="textarea"
        />
      </div>
    </Form>
  );
}

export default ServiceForm;
