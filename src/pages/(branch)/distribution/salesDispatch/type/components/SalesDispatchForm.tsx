import CustomDatePicker from "@/components/form/CustomDateField";
import CustomInputField from "@/components/form/CustomInputField";
import CustomSelectField from "@/components/form/CustomSelectField";
import { Form } from "@/components/ui/form";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints, salesEndpoints } from "@/config/endpoints";
import { useQuery } from "@tanstack/react-query";
import type useSalesDispatchFormActions from "../useSalesDispatchFormActions";

type Props = {
  form: ReturnType<typeof useSalesDispatchFormActions>["form"];
};

function SalesDispatchForm({ form }: Props) {
  const { data: sellers } = useQuery({
    queryKey: ["sellers-select"],
    queryFn: async () => {
      const response = await authInstance.get(salesEndpoints.SELLERS, {
        params: { limit: 100 },
      });
      return response.results || [];
    },
  });

  const { data: finishedGoods } = useQuery({
    queryKey: ["finished-goods-select"],
    queryFn: async () => {
      const response = await authInstance.get(operationsEndpoints.FINISHED_GOODS, {
        params: { limit: 100 },
      });
      return response.results || [];
    },
  });

  const sellerOptions =
    sellers?.map((s: any) => ({
      label: s.name,
      value: s.id,
    })) || [];

  const finishedGoodOptions =
    finishedGoods?.map((fg: any) => ({
      label: `${fg.product_name} - ${fg.batch_number} (${fg.quantity_available ?? 0} available)`,
      value: fg.id,
    })) || [];

  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomSelectField
            nameValue="seller_id"
            labelValue="Seller"
            placeholder="Select seller"
            options={sellerOptions}
            required
          />
          <CustomSelectField
            nameValue="finished_good_id"
            labelValue="Finished Good"
            placeholder="Select finished good"
            options={finishedGoodOptions}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="batch_number"
            labelValue="Batch Number"
            placeholder="e.g. BATCH-2026-001"
            required
          />
          <CustomDatePicker
            nameValue="order_date"
            labelValue="Order Date"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="quantity_allocated"
            labelValue="Quantity Allocated"
            placeholder="e.g. 50"
            type="number"
            required
          />
          <CustomInputField
            nameValue="selling_price_per_unit"
            labelValue="Selling Price Per Unit"
            placeholder="e.g. 120"
            type="number"
            required
          />
        </div>
      </div>
    </Form>
  );
}

export default SalesDispatchForm;
