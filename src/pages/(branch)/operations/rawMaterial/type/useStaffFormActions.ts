import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { rawMaterialKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import {
  MaterialAddSchema,
  MaterialDefaultValues,
  MaterialEditSchema,
  type MaterialAdd as MaterialAddType,
  type MaterialEdit as MaterialEditType,
} from "@/schema/(branchSchema)/operations/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

function useMaterialFormActions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { materialId } = location.state || {};

  const { type } = useParams();
  const isEditMode = type === "edit";

  const form = useForm({
    defaultValues: MaterialDefaultValues,
    resolver: zodResolver(isEditMode ? MaterialEditSchema : MaterialAddSchema),
  });

  const navigate = useNavigate();

  const editMaterialMutation = useMutation({
    mutationFn: async (formData: MaterialEditType) => {
      return await authInstance.patch(
        `${operationsEndpoints.RAW_MATERIALS}${materialId}/`,
        formData,
      );
    },
    onSuccess: () => {
      notify({
        title: "Material Updated",
        message: "The material has been updated successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [rawMaterialKeys.ALL_RAW_MATERIALS] });
      navigate("/raw-material");
    },
    onError: (error) => {
      notify({
        title: "Error Updating Material",
        message:
          error?.message ||
          "There was an error updating the material. Please try again.",
        variant: "error",
      });
    },
  });

  const addMaterialMutation = useMutation({
    mutationFn: async (formData: MaterialAddType) => {
      return await authInstance.post(`${operationsEndpoints.RAW_MATERIALS}`, formData);
    },
    onSuccess: () => {
      notify({
        title: "Material Added",
        message: "The material has been added successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [rawMaterialKeys.ALL_RAW_MATERIALS] });
      navigate("/raw-material");
    },
    onError: (error) => {
      notify({
        title: "Error Adding Material",
        message:
          error?.message ||
          "There was an error adding the material. Please try again.",
        variant: "error",
      });
    },
  });

  const onSubmit = (
    formData: MaterialAddType | MaterialEditType,
  ) => {
    if (isEditMode) {
      editMaterialMutation.mutate(formData as MaterialEditType);
    } else {
      addMaterialMutation.mutate(formData as MaterialAddType);
    }
  };

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [rawMaterialKeys.RAW_MATERIAL_DETAIL, materialId],
    queryFn: async () => {
      const response = await authInstance.get(
        `${operationsEndpoints.RAW_MATERIALS}${materialId}/`,
      );
      return response;
    },
    enabled: isEditMode && !!materialId,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        material_id: data?.material_id || "",
        material_name: data?.material_name || "",
        category: data?.category || undefined,
        uom: data?.uom || undefined,
      });
    }
  }, [data, form]);

  return {
    form,
    onSubmit,
    isEditMode,
    data: { data, isLoading, ...rest },
    isPending: editMaterialMutation.isPending || addMaterialMutation.isPending,
  };
}

export default useMaterialFormActions;
