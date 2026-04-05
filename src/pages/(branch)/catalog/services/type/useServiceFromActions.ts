import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { customerKeys } from "@/config/querykeys/(branchKeys)/customerKey";
import { serviceKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import {
  ServiceAddFormSchema,
  ServiceDefaultValues,
  ServiceEditFormSchema,
  type ServiceAddFormSchemaType,
  type ServiceEditFormSchemaType,
} from "@/schema/(branchSchema)/catalog/ServiceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

function useServiceFormActions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { serviceId } = location.state || {};

  const { type } = useParams();
  const isEditMode = type === "edit";

  const form = useForm({
    defaultValues: ServiceDefaultValues,
    resolver: zodResolver(
      isEditMode ? ServiceEditFormSchema : ServiceAddFormSchema,
    ),
  });

  const editServiceMutation = useMutation({
    mutationFn: async (formData: ServiceEditFormSchemaType) => {
      return await authInstance.patch(
        `${branchEndpoints.SERVICES}${serviceId}/`,
        formData,
      );
    },
    onSuccess: () => {
      notify({
        title: "Service Updated",
        message: "The service has been updated successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [customerKeys.ALL_CUSTOMERS] });
      navigate("/catalog/services");
    },
    onError: (error) => {
      notify({
        title: "Error Updating Service",
        message:
          error?.message ||
          "There was an error updating the service. Please try again.",
        variant: "error",
      });
    },
  });
  const navigate = useNavigate();

  const addServiceMutation = useMutation({
    mutationFn: async (formData: ServiceAddFormSchemaType) => {
      return await authInstance.post(`${branchEndpoints.SERVICES}`, formData);
    },
    onSuccess: () => {
      notify({
        title: "Service Added",
        message: "The service has been added successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [customerKeys.ALL_CUSTOMERS] });
      navigate("/catalog/services");
    },
    onError: (error) => {
      notify({
        title: "Error Adding Service",
        message:
          error?.message ||
          "There was an error adding the service. Please try again.",
        variant: "error",
      });
    },
  });

  const onSubmit = (
    formData: ServiceAddFormSchemaType | ServiceEditFormSchemaType,
  ) => {
    if (isEditMode) {
      editServiceMutation.mutate(formData);
    } else {
      addServiceMutation.mutate(formData as ServiceAddFormSchemaType);
    }
  };

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [serviceKeys.ALL_SERVICES, serviceId],
    queryFn: async () => {
      const response = await authInstance.get(
        `${branchEndpoints.SERVICES}${serviceId}/`,
      );
      return response;
    },
    enabled: isEditMode && !!serviceId,
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
    isPending: editServiceMutation.isPending || addServiceMutation.isPending,
  };
}

export default useServiceFormActions;
