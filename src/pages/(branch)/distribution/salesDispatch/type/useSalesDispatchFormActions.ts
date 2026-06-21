import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { salesEndpoints } from "@/config/endpoints";
import {
  finishedGoodKeys,
  transferKeys,
} from "@/config/querykeys/(branchKeys)/operationsKeys";
import { salesDispatchKeys } from "@/config/querykeys/(branchKeys)/salesKeys";
import {
  SalesDispatchSchema,
  SalesDispatchDefaultValues,
  type SalesDispatch,
} from "@/schema/(branchSchema)/distribution/salesDispatch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

function useSalesDispatchFormActions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { salesDispatchId } = location.state || {};

  const { type } = useParams();
  const isEditMode = type === "edit";

  const form = useForm<SalesDispatch>({
    defaultValues: SalesDispatchDefaultValues,
    resolver: zodResolver(SalesDispatchSchema),
  });

  const navigate = useNavigate();

  const editSalesDispatchMutation = useMutation({
    mutationFn: async (formData: SalesDispatch) => {
      const payload = {
        ...formData,
      };
      return await authInstance.patch(
        `${salesEndpoints.SALES_DISPATCHES}${salesDispatchId}/`,
        payload,
      );
    },
    onSuccess: () => {
      notify({
        title: "Sales Dispatch Updated",
        message: "The sales dispatch has been updated successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: [salesDispatchKeys.ALL_SALES_DISPATCHES],
      });
      queryClient.invalidateQueries({
        queryKey: [finishedGoodKeys.ALL_FINISHED_GOODS],
      });
      navigate("/sales-dispatch");
    },
    onError: (error) => {
      notify({
        title: "Error Updating Sales Dispatch",
        message:
          error?.message ||
          "There was an error updating the sales dispatch. Please try again.",
        variant: "error",
      });
    },
  });

  const addSalesDispatchMutation = useMutation({
    mutationFn: async (formData: SalesDispatch) => {
      const payload = {
        ...formData,
      };
      return await authInstance.post(`${salesEndpoints.SALES_DISPATCHES}`, payload);
    },
    onSuccess: () => {
      notify({
        title: "Sales Dispatch Added",
        message: "The sales dispatch has been added successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: [salesDispatchKeys.ALL_SALES_DISPATCHES],
      });
      queryClient.invalidateQueries({
        queryKey: [finishedGoodKeys.ALL_FINISHED_GOODS],
      });
      queryClient.invalidateQueries({
        queryKey: [transferKeys.ALL_TRANSFERS],
      });
      navigate("/sales-dispatch");
    },
    onError: (error) => {
      notify({
        title: "Error Adding Sales Dispatch",
        message:
          error?.message ||
          "There was an error adding the sales dispatch. Please try again.",
        variant: "error",
      });
    },
  });

  const onSubmit = (formData: SalesDispatch) => {
    if (isEditMode) {
      editSalesDispatchMutation.mutate(formData);
    } else {
      addSalesDispatchMutation.mutate(formData);
    }
  };

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [salesDispatchKeys.SALES_DISPATCH_DETAIL, salesDispatchId],
    queryFn: async () => {
      const response = await authInstance.get(
        `${salesEndpoints.SALES_DISPATCHES}${salesDispatchId}/`,
      );
      return response;
    },
    enabled: isEditMode && !!salesDispatchId,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        seller_id: data?.seller_id || "",
        finished_good_id: data?.finished_good_id || "",
        quantity_allocated: Number(data?.quantity_allocated) || 0,
        selling_price_per_unit: Number(data?.selling_price_per_unit) || 0,
        order_date: data?.order_date || undefined,
        batch_number: data?.batch_number || "",
      });
    }
  }, [data, form]);

  return {
    form,
    onSubmit,
    isEditMode,
    data: { data, isLoading, ...rest },
    isPending:
      editSalesDispatchMutation.isPending ||
      addSalesDispatchMutation.isPending,
  };
}

export default useSalesDispatchFormActions;
