import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { productionKeys, rawMaterialKeys, transferKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import {
  ProductionOrderSchema,
  ProductionOrderDefaultValues,
  type ProductionOrder,
} from "@/schema/(branchSchema)/operations/production";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

function useProductionFormActions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { productionOrderId } = location.state || {};

  const { type } = useParams();
  const isEditMode = type === "edit";

  const form = useForm<ProductionOrder>({
    defaultValues: ProductionOrderDefaultValues,
    resolver: zodResolver(ProductionOrderSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "consumptions",
  });

  const navigate = useNavigate();

  const addProductionMutation = useMutation({
    mutationFn: async (formData: ProductionOrder) => {
      const payload = {
        ...formData,
        production_date: formData.productionDate,
        quantity_produced: formData.quantityProduced,
        product_name: formData.productName,
        batch_number: formData.batchNumber,
        supervisor_name: formData.supervisorName,
        machine_line_number: formData.machineLineNumber,
        consumptions: formData.consumptions,
      };
      return await authInstance.post(`${operationsEndpoints.PRODUCTION_ORDERS}`, payload);
    },
    onSuccess: () => {
      notify({
        title: "Production Order Created",
        message: "The production order has been created successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [productionKeys.ALL_PRODUCTION_ORDERS] });
      queryClient.invalidateQueries({ queryKey: [rawMaterialKeys.ALL_RAW_MATERIALS] });
      queryClient.invalidateQueries({ queryKey: [transferKeys.ALL_TRANSFERS] });
      navigate("/production");
    },
    onError: (error) => {
      notify({
        title: "Error Creating Production Order",
        message:
          error?.message ||
          "There was an error creating the production order. Please try again.",
        variant: "error",
      });
    },
  });

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [productionKeys.PRODUCTION_ORDER_DETAIL, productionOrderId],
    queryFn: async () => {
      const response = await authInstance.get(
        `${operationsEndpoints.PRODUCTION_ORDERS}${productionOrderId}/`,
      );
      return response;
    },
    enabled: isEditMode && !!productionOrderId,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        batchNumber: data?.batch_number || "",
        productName: data?.product_name || "",
        quantityProduced: Number(data?.quantity_produced) || 0,
        productionDate: data?.production_date || undefined,
        shift: data?.shift || undefined,
        supervisorName: data?.supervisor_name || "",
        machineLineNumber: data?.machine_line_number || "",
        consumptions: data?.consumptions?.map((c: any) => ({
          raw_material_id: c.raw_material_id,
          quantity_consumed: Number(c.quantity_consumed),
        })) || [{ raw_material_id: "", quantity_consumed: 0 }],
      });
    }
  }, [data, form]);

  const onSubmit = (formData: ProductionOrder) => {
    addProductionMutation.mutate(formData);
  };

  return {
    form,
    onSubmit,
    isEditMode,
    fields,
    append,
    remove,
    data: { data, isLoading, ...rest },
    isPending: addProductionMutation.isPending,
  };
}

export default useProductionFormActions;
