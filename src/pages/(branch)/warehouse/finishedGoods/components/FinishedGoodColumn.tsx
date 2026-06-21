import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { finishedGoodKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import { format } from "date-fns";

export type FinishedGood = {
  id: string;
  product_name: string;
  batch_number: string;
  quantity_available: number;
  received_at: string;
};

export const finishedGoodColumns: ColumnDef<FinishedGood>[] = [
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
    accessorKey: "product_name",
    header: "PRODUCT NAME",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {row.original.product_name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "batch_number",
    header: "BATCH NUMBER",
    cell: ({ row }) => {
      return (
        <span className="font-bold text-primary">
          {row.original.batch_number || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "quantity_available",
    header: "QUANTITY AVAILABLE",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.quantity_available ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "received_at",
    header: "RECEIVED AT",
    cell: ({ row }) => {
      const date = row.original.received_at;
      return (
        <span className="text-sm text-muted-foreground">
          {date ? format(new Date(date), "PPP") : "—"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    enableHiding: false,
    cell: ({ row }) => {
      const deleteDialogText: deleteModalText = {
        title: "Permanently Delete Finished Good",
        description:
          "This will remove the finished good record. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${operationsEndpoints.FINISHED_GOODS}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[finishedGoodKeys.ALL_FINISHED_GOODS]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];
