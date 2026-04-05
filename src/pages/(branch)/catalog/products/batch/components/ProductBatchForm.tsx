import CustomInputField from "@/components/form/CustomInputField";
import DialogForm from "@/components/globalModels/DialogForm";
import { notify } from "@/components/toast/NotifyToast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { productKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const batchFormSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
});

function ProductBatchForm({
  batch,
  children,
}: {
  batch?: z.infer<typeof batchFormSchema> & { id: number };
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      name: batch?.name || "",
    },
    resolver: zodResolver(batchFormSchema),
  });
  const queryClient = useQueryClient();

  const onAddMutation = useMutation({
    mutationFn: async (data: z.infer<typeof batchFormSchema>) => {
      return authInstance.post(branchEndpoints.PRODUCT_BATCHES, data);
    },
    onSuccess: () => {
      notify({
        variant: "success",
        title: "Batch Added",
        message: "Batch added successfully",
      });
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: [productKeys.PRODUCT_BATCH_LIST],
      });
      form.reset();
    },
    onError: (err) => {
      notify({
        variant: "error",
        title: "Failed to Add Batch",
        message: err?.message || "There was an error adding the batch.",
      });
    },
  });

  const onEditMutation = useMutation({
    mutationFn: async (data: z.infer<typeof batchFormSchema>) => {
      return authInstance.patch(
        `${branchEndpoints.PRODUCT_BATCHES}${batch?.id}/`,
        data,
      );
    },
    onSuccess: () => {
      notify({
        variant: "success",
        title: "Batch Updated",
        message: "Batch updated successfully",
      });
      setIsOpen(false);
      queryClient.invalidateQueries({
        queryKey: [productKeys.PRODUCT_BATCH_LIST],
      });
    },
    onError: (err) => {
      notify({
        variant: "error",
        title: "Failed to Update Batch",
        message: err?.message || "There was an error updating the batch.",
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
            Add Batch
          </Button>
        )
      }
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      config={{
        title: batch ? "Edit Batch" : "Add Batch",
        description: "Manage all studio batches.",
      }}
      onAddAction={form.handleSubmit((data) =>
        batch ? onEditMutation.mutate(data) : onAddMutation.mutate(data),
      )}
      isPending={onAddMutation.isPending || onEditMutation.isPending}
    >
      <Form {...form}>
        <CustomInputField
          nameValue="name"
          labelValue="Batch Name"
          placeholder="eg. Batch 1"
          autoFocus
          required
        />
      </Form>
    </DialogForm>
  );
}

export default ProductBatchForm;
