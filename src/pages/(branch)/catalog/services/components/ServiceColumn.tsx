import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Loader, Info } from "lucide-react";
import { Link } from "react-router";
import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/components/toast/NotifyToast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { serviceKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import type { Service } from "@/types/(branch)/catalog/services";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  active:
    "bg-success-50 text-success-500 hover:bg-success-100 hover:text-success-600",
  inactive:
    "bg-neutral-50 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-800",
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
            "capitalize gap-1 px-3 py-1 h-8 text-sm font-medium rounded-main shadow-none border-none",
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
      await authInstance.patch(`${branchEndpoints.SERVICES}${id}/`, {
        is_active: newStatus === "active",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [serviceKeys.ALL_SERVICES] });
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

export const serviceColumns: ColumnDef<Service>[] = [
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
    header: "SERVICE",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
    cell: ({ row }) => {
      return (
        <Badge className="bg-primary-50 text-primary font-medium">
          {" "}
          {row.original.category?.name || "—"}{" "}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    header: "PRICE",
    cell: ({ row }) => {
      return (
        <span>
          NRs.{" "}
          {Number(row.original.price).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "DURATION",
    cell: ({ row }) => {
      return <span>{row.original.duration} mins</span>;
    },
  },
  {
    accessorKey: "description",
    header: "DESCRIPTION",
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div className="flex items-center gap-1.5 max-w-[250px]">
          <span className="truncate text-muted-foreground">
            {description || "—"}
          </span>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground shrink-0 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
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
        title: "Permanently Delete Service",
        description:
          "This will remove the service and all related appointments and records. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <Link
            to={`/catalog/services/edit`}
            state={{ serviceId: row.original.id }}
          >
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit service</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${branchEndpoints.SERVICES}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[serviceKeys.ALL_SERVICES]}
          />
        </div>
      );
    },
  },
];
