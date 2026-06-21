import CustomInputField from "@/components/form/CustomInputField";
import CustomSelectField from "@/components/form/CustomSelectField";
import { Form } from "@/components/ui/form";
import type useMaterialFormActions from "../useStaffFormActions";

type Props = {
  form: ReturnType<typeof useMaterialFormActions>["form"];
};

function MaterialForm({ form }: Props) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="material_id"
            labelValue="Material ID / Code"
            placeholder="e.g., CHEM-001"
            required
          />
          <CustomInputField
            nameValue="material_name"
            labelValue="Material Name"
            placeholder="e.g., Calcium Carbonate"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomSelectField
            nameValue="category"
            labelValue="Material Category"
            placeholder="Select category"
            options={[
              { label: "Chemical", value: "Chemical" },
              { label: "Abrasive", value: "Abrasive" },
              { label: "Additive", value: "Additive" },
              { label: "Packaging", value: "Packaging" },
            ]}
            required
          />
          <CustomSelectField
            nameValue="uom"
            labelValue="Unit of Measurement"
            placeholder="Select unit"
            options={[
              { label: "Kilogram (kg)", value: "kg" },
              { label: "Litre (l)", value: "litre" },
              { label: "Gram (g)", value: "gram" },
              { label: "Unit", value: "unit" },
            ]}
            required
          />
        </div>
      </div>
    </Form>
  );
}

export default MaterialForm;
