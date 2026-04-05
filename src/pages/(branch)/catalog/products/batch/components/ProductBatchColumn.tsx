import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit } from "lucide-react";
import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { productKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import ProductBatchForm from "./ProductBatchForm";
import type { ProductBatch } from "@/types/(branch)/catalog/product";

export const productBatchColumns: ColumnDef<ProductBatch>[] = [
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
    header: "Batch Name",
    cell: ({ row }) => {
      return <div className="font-medium w-full">{row.original.name}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    size: 100000,
    enableHiding: false,
    cell: ({ row }) => {
      const deleteDialogText: deleteModalText = {
        title: "Permanently Delete Batch",
        description:
          "This will remove the product batch and all related products. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <ProductBatchForm batch={row.original}>
            <button className="cursor-pointer">
              <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="sr-only">Edit batch</span>
            </button>
          </ProductBatchForm>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${branchEndpoints.PRODUCT_BATCHES}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[productKeys.PRODUCT_BATCH_LIST]}
          />
        </div>
      );
    },
  },
];
