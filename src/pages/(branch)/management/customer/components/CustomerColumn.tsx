import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit } from "lucide-react";
import { Link } from "react-router";
import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import { type Customer } from "@/types/(branch)/management/customer";
import { customerKeys } from "@/config/querykeys/(branchKeys)/customerKey";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/toast/NotifyToast";
import StatusDropdown from "@/components/globalModels/statusDropDown";

function ActiveInactive({ status, id }: { status: string; id: number }) {
  const queryClient = useQueryClient();
  const statusChangeMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await authInstance.patch(`${branchEndpoints.CUSTOMER}${id}/`, {
        is_active: newStatus === "active",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [customerKeys.ALL_CUSTOMERS] });
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

export const customerColumns: ColumnDef<Customer>[] = [
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
    header: "CUSTOMER DETAILS",
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {customer.first_name} {customer.last_name}
          </span>
          <span className="text-sm text-muted-foreground">
            {customer.phone_number || "—"}
          </span>
        </div>
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
    accessorKey: "total_visits",
    header: "TOTAL VISITS",
    cell: ({ row }) => {
      return <span>{row.original.total_visits}</span>;
    },
  },
  {
    accessorKey: "total_spent",
    header: "TOTAL SPENT",
    cell: ({ row }) => {
      return (
        <span>
          NRs.{" "}
          {Number(row.original.total_spent).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      return (
        <ActiveInactive
          status={row.original?.is_active ? "active" : "inactive"}
          id={row.original.id}
        />
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    enableHiding: false,
    cell: ({ row }) => {
      const deleteDialogText: deleteModalText = {
        title: "Permanently Delete Customer",
        description:
          "This will remove the customer and all related sessions, appointments, payments, memberships, and packages. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <Link to={`/customer/edit`} state={{ customerId: row.original.id }}>
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit customer</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${branchEndpoints.CUSTOMER}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[customerKeys.ALL_CUSTOMERS]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];
