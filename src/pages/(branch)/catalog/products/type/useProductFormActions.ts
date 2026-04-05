import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { productKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import {
  ProductAddFormSchema,
  ProductDefaultValues,
  ProductEditFormSchema,
  type ProductAddFormSchemaType,
  type ProductEditFormSchemaType,
} from "@/schema/(branchSchema)/catalog/ProductSchema";
import { mergeWithDefaults } from "@/utils/mergeWithDefaults";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

function useProductFormActions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { productId } = location.state || {};
  const navigate = useNavigate();

  const { type } = useParams();
  const isEditMode = type === "edit";

  const form = useForm({
    defaultValues: ProductDefaultValues,
    resolver: zodResolver(
      isEditMode ? ProductEditFormSchema : ProductAddFormSchema,
    ),
  });

  const editProductMutation = useMutation({
    mutationFn: async (formData: ProductEditFormSchemaType) => {
      return await authInstance.patch(
        `${branchEndpoints.PRODUCTS}${productId}/`,
        formData,
      );
    },
    onSuccess: () => {
      notify({
        title: "Product Updated",
        message: "The product has been updated successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: [productKeys.ALL_PRODUCTS],
      });
      navigate("/catalog/products");
    },
    onError: (error) => {
      notify({
        title: "Error Updating Product",
        message:
          error?.message ||
          "There was an error updating the product. Please try again.",
        variant: "error",
      });
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (formData: ProductAddFormSchemaType) => {
      return await authInstance.post(`${branchEndpoints.PRODUCTS}`, formData);
    },
    onSuccess: () => {
      notify({
        title: "Product Added",
        message: "The product has been added successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({
        queryKey: [productKeys.ALL_PRODUCTS],
      });
      navigate("/catalog/products");
    },
    onError: (error) => {
      notify({
        title: "Error Adding Product",
        message:
          error?.message ||
          "There was an error adding the product. Please try again.",
        variant: "error",
      });
    },
  });

  const onSubmit = (
    formData: ProductAddFormSchemaType | ProductEditFormSchemaType,
  ) => {
    if (isEditMode) {
      editProductMutation.mutate(formData);
    } else {
      addProductMutation.mutate(formData as ProductAddFormSchemaType);
    }
  };

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [productKeys.ALL_PRODUCTS, productId],
    queryFn: async () => {
      const response = await authInstance.get(
        `${branchEndpoints.PRODUCTS}${productId}/`,
      );
      return response;
    },
    enabled: isEditMode && !!productId,
  });

  useEffect(() => {
    if (data) {
      form.reset(mergeWithDefaults(data, ProductDefaultValues));
    }
  }, [data, form]);

  return {
    form,
    onSubmit,
    isEditMode,
    data: { data, isLoading, ...rest },
    isPending: editProductMutation.isPending || addProductMutation.isPending,
  };
}

export default useProductFormActions;
