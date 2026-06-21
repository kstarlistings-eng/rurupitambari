import {
  DeleteOrganizationModal,
} from "@/components/globalModels/deleteModel";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Link } from "react-router";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { productionKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import { format } from "date-fns";

type ProductionOrderRow = {
  id: string;
  batch_number: string;
  product_name: string;
  quantity_produced: number;
  production_date: string;
  shift: string;
  supervisor_name: string;
  machine_line_number: string;
  status: string;
};

export const productionColumns: ColumnDef<ProductionOrderRow>[] = [
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
    accessorKey: "production_date",
    header: "PRODUCTION DATE",
    cell: ({ row }) => {
      const date = row.original.production_date;
      return (
        <span className="text-sm text-muted-foreground">
          {date ? format(new Date(date), "PPP") : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "batch_number",
    header: "BATCH / ORDER ID",
    cell: ({ row }) => {
      return (
        <span className="font-bold text-primary">
          {row.original.batch_number || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "product_name",
    header: "PRODUCT",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.product_name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "quantity_produced",
    header: "QTY PRODUCED",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.quantity_produced ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "production_details",
    header: "SHIFT & SUPERVISOR",
    cell: ({ row }) => {
      const { shift, supervisor_name } = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{supervisor_name || "—"}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary w-fit mt-1">
            {shift}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "machine_line_number",
    header: "MACHINE / LINE",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.machine_line_number || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 w-fit capitalize">
          {(row.original.status || "pending_transfer").replace("_", " ")}
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
            state={{ productionOrderId: row.original.id }}
          >
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit batch</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${operationsEndpoints.PRODUCTION_ORDERS}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[productionKeys.ALL_PRODUCTION_ORDERS]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];
