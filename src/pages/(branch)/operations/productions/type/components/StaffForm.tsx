import CustomDatePicker from "@/components/form/CustomDateField";
import CustomInputField from "@/components/form/CustomInputField";
import CustomSelectField from "@/components/form/CustomSelectField";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import type useProductionFormActions from "../useProductionFormActions";

type Props = {
  form: ReturnType<typeof useProductionFormActions>["form"];
  fields: ReturnType<typeof useProductionFormActions>["fields"];
  append: ReturnType<typeof useProductionFormActions>["append"];
  remove: ReturnType<typeof useProductionFormActions>["remove"];
};

function ProductionOrderForm({ form, fields, append, remove }: Props) {
  const { data: rawMaterials } = useQuery({
    queryKey: ["raw-materials-select"],
    queryFn: async () => {
      const response = await authInstance.get(operationsEndpoints.RAW_MATERIALS, {
        params: { limit: 100 },
      });
      return response.results || [];
    },
  });

  const materialOptions =
    rawMaterials?.map((m: any) => ({
      label: `${m.material_name} (${m.current_quantity} ${m.uom})`,
      value: m.id,
    })) || [];

  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="productName"
            labelValue="Product Name"
            placeholder="e.g. Pitambari Powder"
            required
          />
          <CustomInputField
            nameValue="quantityProduced"
            labelValue="Quantity Produced"
            placeholder="e.g. 100"
            type="number"
            required
          />
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="machineLineNumber"
            labelValue="Machine / Line Number"
            placeholder="e.g. Line 04 or M-12"
            required
          />
        </div>

        <div className="border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Raw Materials Consumed</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ raw_material_id: "", quantity_consumed: 0 })}
            >
              <Plus size={16} className="mr-1" />
              Add Material
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-6">
                <CustomSelectField
                  nameValue={`consumptions.${index}.raw_material_id`}
                  labelValue="Raw Material"
                  placeholder="Select raw material"
                  options={materialOptions}
                  required
                />
              </div>
              <div className="sm:col-span-4">
                <CustomInputField
                  nameValue={`consumptions.${index}.quantity_consumed`}
                  labelValue="Quantity Consumed"
                  placeholder="e.g. 10"
                  type="number"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                >
                  <Trash2 size={18} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Form>
  );
}

export default ProductionOrderForm;
