import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { expenseKeys, rawMaterialKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import {
  ExpenseSchema,
  ExpenseDefaultValues,
  type Expense,
} from "@/schema/(branchSchema)/operations/expense";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

function useExpenseFormActions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { expenseId } = location.state || {};

  const { type } = useParams();
  const isEditMode = type === "edit";

  const form = useForm<Expense>({
    defaultValues: ExpenseDefaultValues,
    resolver: zodResolver(ExpenseSchema),
  });

  const navigate = useNavigate();

  const editExpenseMutation = useMutation({
    mutationFn: async (formData: Expense) => {
      const payload = {
        ...formData,
      };
      return await authInstance.patch(
        `${operationsEndpoints.EXPENSES}${expenseId}/`,
        payload,
      );
    },
    onSuccess: () => {
      notify({
        title: "Expense Updated",
        message: "The expense has been updated successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [expenseKeys.ALL_EXPENSES] });
      queryClient.invalidateQueries({ queryKey: [rawMaterialKeys.ALL_RAW_MATERIALS] });
      navigate("/expenses");
    },
    onError: (error) => {
      notify({
        title: "Error Updating Expense",
        message:
          error?.message ||
          "There was an error updating the expense. Please try again.",
        variant: "error",
      });
    },
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (formData: Expense) => {
      const payload = {
        ...formData,
      };
      return await authInstance.post(`${operationsEndpoints.EXPENSES}`, payload);
    },
    onSuccess: () => {
      notify({
        title: "Expense Added",
        message: "The expense has been added successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [expenseKeys.ALL_EXPENSES] });
      queryClient.invalidateQueries({ queryKey: [rawMaterialKeys.ALL_RAW_MATERIALS] });
      navigate("/expenses");
    },
    onError: (error) => {
      notify({
        title: "Error Adding Expense",
        message:
          error?.message ||
          "There was an error adding the expense. Please try again.",
        variant: "error",
      });
    },
  });

  const onSubmit = (formData: Expense) => {
    if (isEditMode) {
      editExpenseMutation.mutate(formData);
    } else {
      addExpenseMutation.mutate(formData);
    }
  };

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [expenseKeys.EXPENSE_DETAIL, expenseId],
    queryFn: async () => {
      const response = await authInstance.get(
        `${operationsEndpoints.EXPENSES}${expenseId}/`,
      );
      return response;
    },
    enabled: isEditMode && !!expenseId,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        raw_material_id: data?.raw_material_id || "",
        quantity: Number(data?.quantity) || 0,
        unit_price: Number(data?.unit_price) || 0,
        supplier_name: data?.supplier_name || "",
        supplier_contact: data?.supplier_contact || "",
        supplier_address: data?.supplier_address || "",
        invoice_reference: data?.invoice_reference || "",
        purchase_date: data?.purchase_date || undefined,
      });
    }
  }, [data, form]);

  return {
    form,
    onSubmit,
    isEditMode,
    data: { data, isLoading, ...rest },
    isPending: editExpenseMutation.isPending || addExpenseMutation.isPending,
  };
}

export default useExpenseFormActions;
