import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { authInstance } from "@/config/axios-interceptor";
import { salesEndpoints } from "@/config/endpoints";
import { invoiceKeys } from "@/config/querykeys/(branchKeys)/salesKeys";
import { format } from "date-fns";

export type Invoice = {
  id: string;
  invoice_number: string;
  seller_name: string;
  total_amount: number;
  tax: number;
  status: string;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  paid: "bg-success-50 text-success-500",
  unpaid: "bg-yellow-50 text-yellow-700",
  overdue: "bg-destructive-50 text-destructive-700",
};

export const invoiceColumns: ColumnDef<Invoice>[] = [
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
    accessorKey: "invoice_number",
    header: "INVOICE NUMBER",
    cell: ({ row }) => {
      return (
        <span className="font-bold text-primary">
          {row.original.invoice_number || "—"}
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
    accessorKey: "total_amount",
    header: "TOTAL AMOUNT",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.total_amount ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "tax",
    header: "TAX",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.tax ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status || "unpaid";
      return (
        <span
          className={`text-xs px-2 py-0.5 rounded-full w-fit capitalize ${
            statusStyles[status] || "bg-neutral-100 text-neutral-700"
          }`}
        >
          {status.replace("_", " ")}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "CREATED AT",
    cell: ({ row }) => {
      const date = row.original.created_at;
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
        title: "Permanently Delete Invoice",
        description:
          "This will remove the invoice record. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${salesEndpoints.INVOICES}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[invoiceKeys.ALL_INVOICES]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];
