import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Loader } from "lucide-react";
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
import { productKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import type { Product } from "@/types/(branch)/catalog/product";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  active:
    "bg-success-50 text-success-500 hover:bg-success-100 hover:text-success-600",
  inactive:
    "bg-neutral-50 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-800",
};

const stockStatusStyles: Record<string, string> = {
  in_stock: "text-green-600",
  low_stock: "text-amber-500",
  out_of_stock: "text-red-500",
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
      await authInstance.patch(`${branchEndpoints.PRODUCTS}${id}/`, {
        is_active: newStatus === "active",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [productKeys.ALL_PRODUCTS] });
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

export const productColumns: ColumnDef<Product>[] = [
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
    accessorKey: "sku",
    header: "SKU/BARCODE",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.sku}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.barcode}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
    cell: ({ row }) => {
      return (
        <Badge className="bg-primary-50 text-primary font-medium">
          {row.original.category_detail?.name || "—"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "name",
    header: "PRODUCT / BRAND",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.brand || "—"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "batch",
    header: "BATCH",
    cell: ({ row }) => {
      return <span>{row.original.batch_detail?.name || "—"}</span>;
    },
  },
  {
    accessorKey: "expiry_date",
    header: "EXPIRY DATE",
    cell: ({ row }) => {
      return <span>{row.original.expiry_date || "—"}</span>;
    },
  },
  {
    accessorKey: "selling_price",
    header: "SELLING PRICE",
    cell: ({ row }) => {
      return (
        <span>
          NRs.{" "}
          {Number(row.original.selling_price).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "cost_price",
    header: "COST PRICE",
    cell: ({ row }) => {
      return (
        <span>
          NRs.{" "}
          {Number(row.original.cost_price).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "stock_status",
    header: "STOCK STATUS",
    cell: ({ row }) => {
      const { stock_quantity, stock_status, stock_status_display } =
        row.original;
      const label =
        stock_status === "out_of_stock"
          ? stock_status_display
          : `${stock_quantity} : ${stock_status_display}`;
      return (
        <span
          className={cn("font-medium text-sm", stockStatusStyles[stock_status])}
        >
          {label}
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
          status={row.original.is_active ? "active" : "inactive"}
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
        title: "Permanently Delete Product",
        description:
          "This will remove the product and all related inventory records. This action cannot be undone.",
        btnName: "Confirm Delete",
      };
      return (
        <div className="flex items-center gap-3">
          <Link
            to={`/catalog/products/edit`}
            state={{ productId: row.original.id }}
          >
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit product</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={async () => {
              await authInstance.delete(
                `${branchEndpoints.PRODUCTS}${row.original.id}/`,
              );
            }}
            dialogText={deleteDialogText}
            invalidateKey={[productKeys.ALL_PRODUCTS]}
          />
        </div>
      );
    },
  },
];
