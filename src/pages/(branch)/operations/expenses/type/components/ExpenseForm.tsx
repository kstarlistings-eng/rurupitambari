import CustomDatePicker from "@/components/form/CustomDateField";
import CustomInputField from "@/components/form/CustomInputField";
import CustomSelectField from "@/components/form/CustomSelectField";
import { Form } from "@/components/ui/form";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { useQuery } from "@tanstack/react-query";
import type useExpenseFormActions from "../useExpenseFormActions";

type Props = {
  form: ReturnType<typeof useExpenseFormActions>["form"];
};

function ExpenseForm({ form }: Props) {
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
      label: `${m.material_name} (${m.current_quantity ?? 0} ${m.uom || "unit"})`,
      value: m.id,
    })) || [];

  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomSelectField
            nameValue="raw_material_id"
            labelValue="Raw Material"
            placeholder="Select raw material"
            options={materialOptions}
            required
          />
          <CustomDatePicker
            nameValue="purchase_date"
            labelValue="Purchase Date"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="quantity"
            labelValue="Quantity"
            placeholder="e.g. 100"
            type="number"
            required
          />
          <CustomInputField
            nameValue="unit_price"
            labelValue="Unit Price"
            placeholder="e.g. 50"
            type="number"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="supplier_name"
            labelValue="Supplier Name"
            placeholder="Enter supplier name"
            required
          />
          <CustomInputField
            nameValue="supplier_contact"
            labelValue="Supplier Contact"
            placeholder="Enter supplier contact"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="supplier_address"
            labelValue="Supplier Address"
            placeholder="Enter supplier address"
          />
          <CustomInputField
            nameValue="invoice_reference"
            labelValue="Invoice Reference"
            placeholder="e.g. INV-001"
          />
        </div>
      </div>
    </Form>
  );
}

export default ExpenseForm;
