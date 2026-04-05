import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, Edit, Loader } from "lucide-react";
import { Link } from "react-router";

import { notify } from "@/components/toast/NotifyToast";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { staffKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import type { Staff } from "@/types/(branch)/management/staff";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const statusStyles: Record<string, string> = {
  active: "bg-green-50 text-green-600 border-green-200",
  inactive: "bg-destructive-50 text-destructive-600 border-destructive-200",
};

function StatusDropdown({
  status,
  onStatusChange,
  isUpdating,
}: {
  status: string;
  onStatusChange?: (val: string) => void;
  isUpdating?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "capitalize gap-1 px-3 py-1 h-8 text-sm font-medium rounded-full",
            statusStyles[status],
          )}
          disabled={isUpdating}
        >
          {status}
          {isUpdating ? (
            <Loader className="animate-spin h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {["active", "inactive"].map((opt) => (
            <DropdownMenuItem
              key={opt}
              onSelect={() => onStatusChange?.(opt)}
              className="capitalize"
            >
              {opt}
              {opt === status && (
                <span className="ms-auto text-green-500">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ActiveInactive({ status, id }: { status: string; id: number }) {
  const queryClient = useQueryClient();
  const statusChangeMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await authInstance.patch(`${branchEndpoints.STAFF}${id}/`, {
        is_active: newStatus === "active",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [staffKeys.ALL_STAFF] });
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

export const staffColumns: ColumnDef<Staff>[] = [
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
    accessorKey: "joined_date",
    header: "JOINED DATE",
    cell: ({ row }) => {
      return (
          <span className="text-sm text-muted-foreground">
            {row?.original?.joined_date || "—"}
          </span>
      );
    },
  },
  {
    accessorKey: "staff_details",
    header: "STAFF DETAILS",
    cell: ({ row }) => {
      const stff = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {stff.full_name || "—"}
          </span>
          <span className="text-sm text-muted-foreground">
            {stff.phone || "—"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "specialization",
    header: "SPECIALIZATION",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.specialization || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "EMAIL",
    cell: ({ row }) => {
      return <span>{row.original.email}</span>;
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
        title: "Permanently Delete Staff Member",
        description:
          "This will remove the staff and all related sessions, appointments, payments, memberships, and packages. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <Link to={`/staff/edit`} state={{ staffId: row.original.id }}>
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit staff</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${branchEndpoints.STAFF}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[staffKeys.ALL_STAFF]}
            confirmText="Delete"
          />
        </div>
      );
    },
  },
];
