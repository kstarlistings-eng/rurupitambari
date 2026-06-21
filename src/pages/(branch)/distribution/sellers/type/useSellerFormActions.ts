import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { salesEndpoints } from "@/config/endpoints";
import { sellerKeys } from "@/config/querykeys/(branchKeys)/salesKeys";
import {
  SellerSchema,
  SellerDefaultValues,
  type Seller,
} from "@/schema/(branchSchema)/distribution/seller";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";

function useSellerFormActions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { sellerId } = location.state || {};

  const { type } = useParams();
  const isEditMode = type === "edit";

  const form = useForm<Seller>({
    defaultValues: SellerDefaultValues,
    resolver: zodResolver(SellerSchema),
  });

  const navigate = useNavigate();

  const editSellerMutation = useMutation({
    mutationFn: async (formData: Seller) => {
      return await authInstance.patch(
        `${salesEndpoints.SELLERS}${sellerId}/`,
        formData,
      );
    },
    onSuccess: () => {
      notify({
        title: "Seller Updated",
        message: "The seller has been updated successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [sellerKeys.ALL_SELLERS] });
      navigate("/sellers");
    },
    onError: (error) => {
      notify({
        title: "Error Updating Seller",
        message:
          error?.message ||
          "There was an error updating the seller. Please try again.",
        variant: "error",
      });
    },
  });

  const addSellerMutation = useMutation({
    mutationFn: async (formData: Seller) => {
      return await authInstance.post(`${salesEndpoints.SELLERS}`, formData);
    },
    onSuccess: () => {
      notify({
        title: "Seller Added",
        message: "The seller has been added successfully.",
        variant: "success",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: [sellerKeys.ALL_SELLERS] });
      navigate("/sellers");
    },
    onError: (error) => {
      notify({
        title: "Error Adding Seller",
        message:
          error?.message ||
          "There was an error adding the seller. Please try again.",
        variant: "error",
      });
    },
  });

  const onSubmit = (formData: Seller) => {
    if (isEditMode) {
      editSellerMutation.mutate(formData);
    } else {
      addSellerMutation.mutate(formData);
    }
  };

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [sellerKeys.SELLER_DETAIL, sellerId],
    queryFn: async () => {
      const response = await authInstance.get(
        `${salesEndpoints.SELLERS}${sellerId}/`,
      );
      return response;
    },
    enabled: isEditMode && !!sellerId,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name || "",
        contact_person: data?.contact_person || "",
        phone: data?.phone || "",
        email: data?.email || "",
        address: data?.address || "",
        tax_id: data?.tax_id || "",
        tier: data?.tier || "",
      });
    }
  }, [data, form]);

  return {
    form,
    onSubmit,
    isEditMode,
    data: { data, isLoading, ...rest },
    isPending: editSellerMutation.isPending || addSellerMutation.isPending,
  };
}

export default useSellerFormActions;
