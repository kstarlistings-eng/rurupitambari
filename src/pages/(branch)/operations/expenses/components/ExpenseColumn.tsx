import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Link } from "react-router";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { expenseKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import { format } from "date-fns";
import type { Expense } from "@/schema/(branchSchema)/operations/expense";

export type ExpenseRow = Expense & {
  id: string;
  raw_material_name?: string;
};

export const expenseColumns: ColumnDef<ExpenseRow>[] = [
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
    accessorKey: "purchase_date",
    header: "PURCHASE DATE",
    cell: ({ row }) => {
      const date = row.original.purchase_date;
      return (
        <span className="text-sm text-muted-foreground">
          {date ? format(new Date(date), "PPP") : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "raw_material_name",
    header: "RAW MATERIAL",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {row.original.raw_material_name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "QUANTITY",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.quantity ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "unit_price",
    header: "UNIT PRICE",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.unit_price ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "total_cost",
    header: "TOTAL COST",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.total_cost ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "supplier_name",
    header: "SUPPLIER",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.supplier_name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "invoice_reference",
    header: "INVOICE REF",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.invoice_reference || "—"}
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
        title: "Permanently Delete Expense",
        description:
          "This will remove the expense record. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <Link to={`/expenses/edit`} state={{ expenseId: row.original.id }}>
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit expense</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${operationsEndpoints.EXPENSES}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[expenseKeys.ALL_EXPENSES]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];
