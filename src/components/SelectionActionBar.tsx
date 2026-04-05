// components/table/SelectionActionBar.tsx
import { useSelectionStore } from "@/store/selection-store";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { DeleteOrganizationModal } from "./globalModels/deleteModel";
import { usePageNavigation } from "@/hooks/usePageNavigation";

interface SelectionActionBarProps<T> {
  deleteName?: string;
  children?: (selectedRows: T[]) => React.ReactNode;
  allRows: T[];
  deleteCallBack?: (data: T[]) => void;
  invalidateKeys?: any[];
  dialogText?: {
    title: string;
    description?: string;
    btnName?: string;
  };
  confirmText?: string;
}

export function SelectionActionBar<T>({
  deleteName = "User",
  children,
  allRows,
  deleteCallBack,
  invalidateKeys,
  dialogText,
  confirmText,
}: SelectionActionBarProps<T>) {
  const { selectedRows, clearSelection, setSelectedRows } = useSelectionStore();
  const isAllSelected = selectedRows.length === allRows.length;
  const isVisible = selectedRows.length > 0;
  const { goBack } = usePageNavigation();

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-3 px-4 py-3",
        "bg-white text-neutral-700 rounded-xl shadow-sm",
        "transition-all duration-200",
        isVisible
          ? "opacity-100 animate-in slide-in-from-bottom-4 fade-in duration-200"
          : "opacity-0 animate-out slide-out-to-bottom-4 fade-out duration-100 pointer-events-none",
      )}
    >
      <span className="text-sm font-medium pr-2 border-r border-neutral-700 flex items-center gap-2">
        <Checkbox
          className="cursor-pointer"
          checked={isAllSelected}
          onCheckedChange={(checked) => {
            setSelectedRows(checked ? allRows : []);
          }}
        />
        Select All ({selectedRows.length})
      </span>

      <div className="flex items-center gap-2">
        {children?.(selectedRows as T[])}
        {deleteCallBack && (
          <DeleteOrganizationModal
            confirmText={confirmText}
            dialogText={{
              title: dialogText?.title || `Delete ${deleteName}`,
              description:
                dialogText?.description || "This action cannot be undone.",
              btnName: dialogText?.btnName || `Delete ${deleteName}`,
            }}
            onConfirm={() => deleteCallBack?.(selectedRows as T[])}
            invalidateKey={invalidateKeys}
            triggerBtn={
              <Button className="py-1" variant="destructive">
                Delete
              </Button>
            }
            onSuccessCallback={() => {
              if (isAllSelected) {
                goBack();
              }
              clearSelection();
            }}
          />
        )}
      </div>

      <button
        onClick={clearSelection}
        className="ml-0.5 p-1 rounded-md hover:bg-primary-50 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4 text-neutral-500 hover:text-primary-500" />
      </button>
    </div>
  );
}
