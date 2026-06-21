import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Link } from "react-router";
import { authInstance } from "@/config/axios-interceptor";
import { salesEndpoints } from "@/config/endpoints";
import { salesDispatchKeys } from "@/config/querykeys/(branchKeys)/salesKeys";
import { format } from "date-fns";
import type { SalesDispatch } from "@/schema/(branchSchema)/distribution/salesDispatch";

export type SalesDispatchRow = SalesDispatch & {
  id: string;
  seller_name?: string;
  finished_good_name?: string;
  status?: string;
};

export const salesDispatchColumns: ColumnDef<SalesDispatchRow>[] = [
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
    accessorKey: "order_date",
    header: "ORDER DATE",
    cell: ({ row }) => {
      const date = row.original.order_date;
      return (
        <span className="text-sm text-muted-foreground">
          {date ? format(new Date(date), "PPP") : "—"}
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
    accessorKey: "seller_name",
    header: "SELLER",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {row.original.seller_name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "finished_good_name",
    header: "FINISHED GOOD",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.finished_good_name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "quantity_allocated",
    header: "QTY ALLOCATED",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.quantity_allocated ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "selling_price_per_unit",
    header: "PRICE / UNIT",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.selling_price_per_unit ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status || "pending";
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 w-fit capitalize">
          {status.replace("_", " ")}
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
        title: "Permanently Delete Sales Dispatch",
        description:
          "This will remove the sales dispatch record. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <Link
            to={`/sales-dispatch/edit`}
            state={{ salesDispatchId: row.original.id }}
          >
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit dispatch</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${salesEndpoints.SALES_DISPATCHES}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[salesDispatchKeys.ALL_SALES_DISPATCHES]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];
