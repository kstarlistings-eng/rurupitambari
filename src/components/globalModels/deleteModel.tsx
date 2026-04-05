import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Loader, Trash2 } from "lucide-react";
import { notify } from "../toast/NotifyToast";

export type deleteModalText = {
  title: string;
  description?: string;
  btnName?: string;
};

interface DeleteOrganizationModalProps {
  dialogText: deleteModalText;
  triggerBtn?: React.ReactNode;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  invalidateKey?: any[];
  onSuccessCallback?: () => void;
  deleteItemName?: string;
  loadingBtnText?: string;
  children?: React.ReactNode;
  showDefaultNotification?: boolean;
  /** The text the user must type to confirm deletion (e.g. "Delete"). When set, shows a confirmation input. */
  confirmText?: string;
  customComponent?: React.ReactNode;
}

export function DeleteOrganizationModal({
  dialogText,
  triggerBtn = <Trash2 className="h-4 w-4 text-destructive-500" />,
  onConfirm,
  isLoading = false,
  invalidateKey,
  onSuccessCallback,
  deleteItemName = "item",
  loadingBtnText = "Deleting...",
  showDefaultNotification = true,
  children,
  confirmText,
  customComponent,
}: DeleteOrganizationModalProps) {
  const queryClient = useQueryClient();
  const [open, onOpenChange] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const requiresConfirmation = !!confirmText;
  const isConfirmed = !requiresConfirmation || confirmInput === confirmText;

  // Add this state near the top of the component
  const [showError, setShowError] = useState(false);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => await Promise.resolve(onConfirm()),
    onSuccess: () => {
      if (showDefaultNotification) {
        notify({
          title: "Deleted",
          message: `The ${deleteItemName} has been deleted successfully.`,
          variant: "success",
        });
      }
      queryClient.invalidateQueries({
        queryKey: invalidateKey,
      });
      onSuccessCallback?.();
      setConfirmInput("");
      onOpenChange(false);
    },
    onError: (error) => {
      if (showDefaultNotification) {
        notify({
          title: "Error",
          message:
            error?.message ||
            `There was an error deleting the ${deleteItemName}. Please try again.`,
          variant: "error",
        });
      }
    },
  });

  const handleConfirm = async () => {
    if (!isConfirmed) return;
    await mutateAsync();
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) setConfirmInput("");
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <div className="cursor-pointer">
            {triggerBtn}
            <span className="sr-only">{dialogText.title}</span>
          </div>
        )}
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="sm:p-[34px] p-8 sm:max-w-[520px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[20px] text-neutral-800 font-semibold">
            {dialogText.title}
          </DialogTitle>
          <DialogDescription className="text-neutral-500">
            {dialogText?.description || "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        {customComponent}

        {requiresConfirmation && (
          <div className="rounded-lg border border-dashed border-destructive/40 bg-destructive/5 p-4 space-y-2">
            <p className="text-sm text-neutral-700">
              Type{" "}
              <span className="font-semibold text-destructive">
                &ldquo;{confirmText}&rdquo;
              </span>{" "}
              to confirm
            </p>
            <Input
              value={confirmInput}
              onChange={(e) => {
                setConfirmInput(e.target.value);
                setShowError(false);
                if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
                errorTimerRef.current = setTimeout(
                  () => setShowError(true),
                  1000,
                );
              }}
              placeholder={`Type ${confirmText?.toLowerCase()} here`}
              className="border-none rounded-[8px] focus-visible:ring-1 focus-visible:ring-destructive px-3 py-3 text-neutral-900 placeholder:text-neutral-400 bg-white"
              autoComplete="off"
            />
            {confirmInput.length > 0 && (isConfirmed || showError) && (
              <p
                className={`text-xs ${
                  isConfirmed ? "text-success-500" : "text-destructive-500"
                }`}
              >
                {isConfirmed
                  ? "Confirmation text matches. You may proceed."
                  : `Text does not match. Please type "${confirmText}" exactly.`}
              </p>
            )}
          </div>
        )}

        <DialogFooter className="bg-white border-none flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="shadow-none sm:me-auto sm:w-auto w-full"
          >
            Cancel
          </Button>
          <Button
            variant="delete"
            className="sm:w-auto w-full"
            onClick={handleConfirm}
            disabled={isLoading || isPending || !isConfirmed}
          >
            {isLoading || isPending ? (
              <>
                <Loader className="animate-spin" />
                {loadingBtnText}
              </>
            ) : (
              `${dialogText?.btnName || "Delete"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
