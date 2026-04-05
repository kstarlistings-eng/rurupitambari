import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit } from "lucide-react";
import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { serviceKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import type { ServiceCategory } from "@/types/(branch)/catalog/services";
import ServiceCategoryForm from "./ServiceCategoryForm";

export const serviceCategoryColumns: ColumnDef<ServiceCategory>[] = [
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
    header: "Category Name",

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
        title: "Permanently Delete Category",
        description:
          "This will remove the service category and all related services. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <ServiceCategoryForm category={row.original}>
            <button className="cursor-pointer">
              <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="sr-only">Edit category</span>
            </button>
          </ServiceCategoryForm>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${branchEndpoints.SERVICE_CATEGORIES}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[serviceKeys.SERVICE_CATEGORY_LIST]}
          />
        </div>
      );
    },
  },
];
