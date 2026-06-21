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
import { sellerKeys } from "@/config/querykeys/(branchKeys)/salesKeys";
import type { Seller } from "@/schema/(branchSchema)/distribution/seller";

export const sellerColumns: ColumnDef<Seller & { id: string }>[] = [
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
    accessorKey: "name",
    header: "SELLER NAME",
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          {row.original.name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "contact_person",
    header: "CONTACT PERSON",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.contact_person || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "PHONE",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.phone || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.email || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "address",
    header: "ADDRESS",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.address || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "tax_id",
    header: "TAX ID",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.tax_id || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "tier",
    header: "TIER",
    cell: ({ row }) => {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 w-fit capitalize">
          {row.original.tier || "—"}
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
        title: "Permanently Delete Seller",
        description:
          "This will remove the seller record. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <Link to={`/sellers/edit`} state={{ sellerId: row.original.id }}>
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit seller</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${salesEndpoints.SELLERS}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[sellerKeys.ALL_SELLERS]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];
