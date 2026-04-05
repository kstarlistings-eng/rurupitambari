import CustomDatePicker from "@/components/form/CustomDateField";
import CustomInputField from "@/components/form/CustomInputField";
import CustomSelectField from "@/components/form/CustomSelectField"; // Assuming you have a Select component
import { Form } from "@/components/ui/form";
import useProductionFormActions from "../useProductionFormActions";

type Props = {
  form: ReturnType<typeof useProductionFormActions>["form"];
};

function ProductionOrderForm({ form }: Props) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        {/* Row 1: Batch Number and Production Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="batchNumber"
            labelValue="Batch Number / Order ID"
            placeholder="e.g. BATCH-2026-001"
            required
          />
          <CustomDatePicker
            nameValue="productionDate"
            labelValue="Production Date"
            required
          />
        </div>

        {/* Row 2: Shift and Supervisor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomSelectField
            nameValue="shift"
            labelValue="Shift"
            placeholder="Select shift"
            options={[
              { label: "Morning", value: "Morning" },
              { label: "Afternoon", value: "Afternoon" },
              { label: "Night", value: "Night" },
            ]}
            required
          />
          <CustomInputField
            nameValue="supervisorName"
            labelValue="Supervisor Name"
            placeholder="Enter supervisor's name"
            required
          />
        </div>

        {/* Row 3: Machine/Line Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="machineLineNumber"
            labelValue="Machine / Line Number"
            placeholder="e.g. Line 04 or M-12"
            required
          />
          {/* Empty div for alignment if needed, or leave for future fields */}
          <div className="hidden sm:block" />
        </div>
      </div>
    </Form>
  );
}

export default ProductionOrderForm;