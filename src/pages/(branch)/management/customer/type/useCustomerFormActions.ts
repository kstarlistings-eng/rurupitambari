import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { customerKeys } from "@/config/querykeys/(branchKeys)/customerKey";
import {
  CustomerAddFormSchema,
  CustomerDefaultValues,
  CustomerEditFormSchema,
  type CustomerAddFormSchemaType,
  type CustomerEditFormSchemaType,
} from "@/schema/(branchSchema)/management/CustomerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

function useCustomerFormActions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { customerId } = location.state || {};

  const { type } = useParams();
  const isEditMode = type === "edit";

  const form = useForm({
    defaultValues: CustomerDefaultValues,
    resolver: zodResolver(
      isEditMode ? CustomerEditFormSchema : CustomerAddFormSchema,
    ),
  });

  const editCustomerMutation = useMutation({
    mutationFn: async (formData: CustomerEditFormSchemaType) => {
      return await authInstance.patch(
        `${branchEndpoints.CUSTOMER}${customerId}/`,
        formData,
      );
    },
    onSuccess: () => {
      notify({
        title: "Customer Updated",
        message: "The customer has been updated successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [customerKeys.ALL_CUSTOMERS] });
      navigate("/customer");
    },
    onError: (error) => {
      notify({
        title: "Error Updating Customer",
        message:
          error?.message ||
          "There was an error updating the customer. Please try again.",
        variant: "error",
      });
    },
  });
  const navigate = useNavigate();

  const addCustomerMutation = useMutation({
    mutationFn: async (formData: CustomerAddFormSchemaType) => {
      return await authInstance.post(`${branchEndpoints.CUSTOMER}`, formData);
    },
    onSuccess: () => {
      notify({
        title: "Customer Added",
        message: "The customer has been added successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [customerKeys.ALL_CUSTOMERS] });
      navigate("/customer");
    },
    onError: (error) => {
      notify({
        title: "Error Adding Customer",
        message:
          error?.message ||
          "There was an error adding the customer. Please try again.",
        variant: "error",
      });
    },
  });

  const onSubmit = (
    formData: CustomerAddFormSchemaType | CustomerEditFormSchemaType,
  ) => {
    if (isEditMode) {
      editCustomerMutation.mutate(formData);
    } else {
      addCustomerMutation.mutate(formData as CustomerAddFormSchemaType);
    }
  };

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [customerKeys.ALL_CUSTOMERS, customerId],
    queryFn: async () => {
      const response = await authInstance.get(
        `${branchEndpoints.CUSTOMER}${customerId}/`,
      );
      return response;
    },
    enabled: isEditMode && !!customerId,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        gender: data?.gender || undefined,
        date_of_birth: data?.date_of_birth || undefined,
        address: data?.address || undefined,
        note: data?.note || undefined,
      });
    }
  }, [data, form]);

  return {
    form,
    onSubmit,
    isEditMode,
    data: { data, isLoading, ...rest },
    isPending: editCustomerMutation.isPending || addCustomerMutation.isPending,
  };
}

export default useCustomerFormActions;
