import CustomInputField from "@/components/form/CustomInputField";
import DialogForm from "@/components/globalModels/DialogForm";
import { notify } from "@/components/toast/NotifyToast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { serviceKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

function ServiceCategoryForm({
  category,
  children,
}: {
  category?: z.infer<typeof categoryFormSchema> & { id: number };
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      name: category?.name || "",
    },
    resolver: zodResolver(categoryFormSchema),
  });
  const queryClient = useQueryClient();

  const onAddMutation = useMutation({
    mutationFn: async (data: z.infer<typeof categoryFormSchema>) => {
      return authInstance.post(branchEndpoints.SERVICE_CATEGORIES, data);
    },
    onSuccess: () => {
      notify({
        variant: "success",
        title: "Category Added",
        message: "Category added successfully",
      });
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: [serviceKeys.SERVICE_CATEGORY_LIST],
      });
    },
    onError: (err) => {
      notify({
        variant: "error",
        title: "Failed to Add Category",
        message: err?.message || "There was an error adding the category.",
      });
    },
  });

  const onEditMutation = useMutation({
    mutationFn: async (data: z.infer<typeof categoryFormSchema>) => {
      return authInstance.patch(
        `${branchEndpoints.SERVICE_CATEGORIES}${category?.id}/`,
        data,
      );
    },
    onSuccess: () => {
      notify({
        variant: "success",
        title: "Category Updated",
        message: "Category updated successfully",
      });
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: [serviceKeys.SERVICE_CATEGORY_LIST],
      });
    },
    onError: (err) => {
      notify({
        variant: "error",
        title: "Failed to Update Category",
        message: err?.message || "There was an error updating the category.",
      });
    },
  });
  return (
    <DialogForm
      triggerButton={
        children ? (
          children
        ) : (
          <Button variant={"default"}>
            <Plus size={18} />
            Add Category
          </Button>
        )
      }
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      config={{
        title: category ? "Edit Category" : "Add Category",
        description: "Manage all studio categories. ",
      }}
      onAddAction={form.handleSubmit((data) =>
        category ? onEditMutation.mutate(data) : onAddMutation.mutate(data),
      )}
      isPending={onAddMutation.isPending || onEditMutation.isPending}
    >
      <Form {...form}>
        <CustomInputField
          nameValue="name"
          labelValue="Category Name"
          placeholder="eg. Hair, Massage, Facial etc."
          autoFocus
          required
        />
      </Form>
    </DialogForm>
  );
}

export default ServiceCategoryForm;
