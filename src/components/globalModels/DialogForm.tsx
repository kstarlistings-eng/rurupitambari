import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Loader, XIcon } from "lucide-react";

type Props = {
  children: React.ReactNode;
  onAddAction?: () => void;
  triggerButton: React.ReactNode;
  isPending?: boolean;
  config: {
    title: string;
    description?: string;
    saveButtonText?: string;
    cancelButtonText?: string;
    saveButton?: React.ReactNode;
    cancelButton?: React.ReactNode;
  };
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function DialogForm({
  children,
  onAddAction,
  triggerButton,
  isPending,
  config,
  isOpen,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent
        className="sm:max-w-[520px] p-0"
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAddAction?.();
          }}
          className="w-full"
        >
          <DialogHeader className="border-b border-neutral-200 p-7.5 pb-4.5">
            <DialogTitle className="text-black text-lg font-semibold flex items-center gap-2 justify-between">
              {config.title}
              <DialogClose asChild>
                <XIcon
                  size={24}
                  className="text-neutral-500 rounded-md hover:bg-neutral-50 p-1 cursor-pointer"
                />
              </DialogClose>
            </DialogTitle>
            {config?.description && (
              <DialogDescription>{config.description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="px-7.5 py-4.5 max-h-[60vh] overflow-y-auto">
            {children}
          </div>
          <div className="w-full flex gap-4 items-center justify-center pt-4.5 pb-7.5 px-5">
            <DialogClose asChild>
              {config?.cancelButton ? (
                config.cancelButton
              ) : (
                <Button variant="outline" disabled={isPending}>
                  {config?.cancelButtonText || "Cancel"}
                </Button>
              )}
            </DialogClose>
            {config?.saveButton ? (
              config.saveButton
            ) : (
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader className="animate-spin" /> {"Saving..."}
                  </>
                ) : (
                  config?.saveButtonText || "Save changes"
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogForm;
