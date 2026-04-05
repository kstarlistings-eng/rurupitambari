import CustomDatePicker from "@/components/form/CustomDateField";
import CustomInputField from "@/components/form/CustomInputField";
// Assuming you have a Select component for Category and Unit
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
        {/* Row 1: ID and Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="materialId"
            labelValue="Material ID / Code"
            placeholder="e.g., CHEM-001"
            required
          />
          <CustomInputField
            nameValue="materialName"
            labelValue="Material Name"
            placeholder="e.g., Calcium Carbonate"
            required
          />
        </div>

        {/* Row 2: Category and Unit of Measurement */}
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
            ]}
            required
          />
        </div>

        {/* Row 3: Purchase Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomDatePicker
            nameValue="purchaseDate"
            labelValue="Purchase Date"
            required
          />
          {/* Empty div or additional field to maintain grid alignment */}
          <div className="hidden sm:block" />
        </div>
      </div>
    </Form>
  );
}

export default MaterialForm;