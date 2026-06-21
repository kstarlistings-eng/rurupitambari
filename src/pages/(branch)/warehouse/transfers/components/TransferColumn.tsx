import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Transfer = {
  id: string;
  production_order: string;
  production_order_batch_number?: string;
  quantity_transferred: number;
  status: "pending" | "received" | string;
  transferred_at: string;
  received_at?: string;
};

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  received: "bg-success-50 text-success-500",
};

export const transferColumns = (
  onReceive: (id: string) => void,
  isReceiving: boolean,
): ColumnDef<Transfer>[] => [
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
    accessorKey: "production_order_batch_number",
    header: "BATCH NUMBER",
    cell: ({ row }) => {
      return (
        <span className="font-bold text-primary">
          {row.original.production_order_batch_number || "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "quantity_transferred",
    header: "QTY TRANSFERRED",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {row.original.quantity_transferred ?? "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status || "pending";
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
    accessorKey: "transferred_at",
    header: "TRANSFERRED AT",
    cell: ({ row }) => {
      const date = row.original.transferred_at;
      return (
        <span className="text-sm text-muted-foreground">
          {date ? format(new Date(date), "PPP") : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "received_at",
    header: "RECEIVED AT",
    cell: ({ row }) => {
      const date = row.original.received_at;
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
      const isPending = row.original.status === "pending";
      return (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={!isPending || isReceiving}
            onClick={() => onReceive(row.original.id)}
          >
            Receive
          </Button>
        </div>
      );
    },
  },
];
