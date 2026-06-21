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
import { rawMaterialKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import type { Material } from "@/schema/(branchSchema)/operations/material";

type MaterialRow = Material & { id: string; current_quantity: number };

export const materialColumns: ColumnDef<MaterialRow>[] = [
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
    accessorKey: "material_id",
    header: "MATERIAL ID",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.material_id || "—"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "material_name",
    header: "MATERIAL NAME",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.material_name || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.category || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "uom",
    header: "UNIT",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.uom || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "current_quantity",
    header: "STOCK",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.current_quantity ?? "—"}
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
        title: "Permanently Delete Material",
        description:
          "This will remove the material from inventory. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <Link to={`/raw-material/edit`} state={{ materialId: row.original.id }}>
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit material</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${operationsEndpoints.RAW_MATERIALS}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[rawMaterialKeys.ALL_RAW_MATERIALS]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];
