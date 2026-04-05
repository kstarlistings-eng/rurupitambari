import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { staffKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import {
  StaffAddFormSchema,
  StaffDefaultValues,
  StaffEditFormSchema,
  type StaffAddFormSchemaType,
  type StaffEditFormSchemaType,
} from "@/schema/(branchSchema)/management/StaffSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

function useProductionFormActions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { staffId } = location.state || {};

  const { type } = useParams();
  const isEditMode = type === "edit";

  const form = useForm({
    defaultValues: StaffDefaultValues,
    resolver: zodResolver(
      isEditMode ? StaffEditFormSchema : StaffAddFormSchema,
    ),
  });

  const editStaffMutation = useMutation({
    mutationFn: async (formData: StaffEditFormSchemaType) => {
      return await authInstance.patch(
        `${branchEndpoints.STAFF}${staffId}/`,
        formData,
      );
    },
    onSuccess: () => {
      notify({
        title: "Staff Updated",
        message: "The staff has been updated successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [staffKeys.ALL_STAFF] });
      navigate("/staff");
    },
    onError: (error) => {
      notify({
        title: "Error Updating Staff",
        message:
          error?.message ||
          "There was an error updating the staff. Please try again.",
        variant: "error",
      });
    },
  });
  const navigate = useNavigate();

  const addStaffMutation = useMutation({
    mutationFn: async (formData: StaffAddFormSchemaType) => {
      return await authInstance.post(`${branchEndpoints.STAFF}`, formData);
    },
    onSuccess: () => {
      notify({
        title: "Staff Added",
        message: "The Staff has been added successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [staffKeys.ALL_STAFF] });
      navigate("/staff");
    },
    onError: (error) => {
      notify({
        title: "Error Adding Staff",
        message:
          error?.message ||
          "There was an error adding the Staff. Please try again.",
        variant: "error",
      });
    },
  });

  const onSubmit = (
    formData: StaffAddFormSchemaType | StaffEditFormSchemaType,
  ) => {
    if (isEditMode) {
      editStaffMutation.mutate(formData);
    } else {
      addStaffMutation.mutate(formData as StaffAddFormSchemaType);
    }
  };

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [staffKeys.ALL_STAFF, staffId],
    queryFn: async () => {
      const response = await authInstance.get(
        `${branchEndpoints.STAFF}${staffId}/`,
      );
      return response;
    },
    enabled: isEditMode && !!staffId,
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
    isPending: editStaffMutation.isPending || addStaffMutation.isPending,
  };
}

export default useProductionFormActions;
