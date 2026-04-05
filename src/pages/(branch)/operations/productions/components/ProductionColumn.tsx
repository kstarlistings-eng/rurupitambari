import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Edit, Loader } from "lucide-react";
import { Link } from "react-router";

import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { staffKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import { format } from "date-fns"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductionOrder } from "@/schema/(branchSchema)/operations/production";

const statusStyles: Record<string, string> = {
  active: "bg-green-50 text-green-600 border-green-200",
  inactive: "bg-destructive-50 text-destructive-600 border-destructive-200",
};

function StatusDropdown({
  status,
  onStatusChange,
  isUpdating,
}: {
  status: string;
  onStatusChange?: (val: string) => void;
  isUpdating?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "capitalize gap-1 px-3 py-1 h-8 text-sm font-medium rounded-full",
            statusStyles[status],
          )}
          disabled={isUpdating}
        >
          {status}
          {isUpdating ? (
            <Loader className="animate-spin h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {["active", "inactive"].map((opt) => (
            <DropdownMenuItem
              key={opt}
              onSelect={() => onStatusChange?.(opt)}
              className="capitalize"
            >
              {opt}
              {opt === status && (
                <span className="ms-auto text-green-500">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ActiveInactive({ status, id }: { status: string; id: number }) {
  const queryClient = useQueryClient();
  const statusChangeMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await authInstance.patch(`${branchEndpoints.STAFF}${id}/`, {
        is_active: newStatus === "active",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [staffKeys.ALL_STAFF] });
    },
    onError: (error) => {
      notify({
        title: "Error",
        message: error?.message || "Failed to update status. Please try again.",
        variant: "error",
      });
    },
  });
  return (
    <StatusDropdown
      isUpdating={statusChangeMutation.isPending}
      status={status}
      onStatusChange={(newStatus) => {
        if (newStatus !== status) {
          statusChangeMutation.mutate(newStatus);
        }
      }}
    />
  );
}



export const productionColumns: ColumnDef<ProductionOrder>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "productionDate",
    header: "PRODUCTION DATE",
    cell: ({ row }) => {
      const date = row.original.productionDate;
      return (
        <span className="text-sm text-muted-foreground">
          {date ? format(new Date(date), "PPP") : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "batchNumber",
    header: "BATCH / ORDER ID",
    cell: ({ row }) => {
      return (
        <span className="font-bold text-primary">
          {row.original.batchNumber || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "production_details",
    header: "SHIFT & SUPERVISOR",
    cell: ({ row }) => {
      const { shift, supervisorName } = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{supervisorName || "—"}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary w-fit mt-1">
            {shift}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "machineLineNumber",
    header: "MACHINE / LINE",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.machineLineNumber || "—"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    enableHiding: false,
    cell: ({ row }) => {
      const deleteDialogText = {
        title: "Delete Production Order",
        description:
          "This will permanently remove this batch record and all associated material logs. This action cannot be undone.",
        btnName: "Confirm Delete",
      };

      return (
        <div className="flex items-center gap-3">
          <Link 
            to={`/production/edit`} 
            state={{ batchId: row.original.batchNumber }}
          >
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit batch</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              // Updated endpoint to reflect production context
              await authInstance.delete(
                `/production/batch/${row.original.batchNumber}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={["PRODUCTION_LIST"]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];