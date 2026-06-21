import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardData } from "../useDashboardData";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

interface RecentSale {
  id: string;
  seller_name: string;
  product_name: string;
  quantity_allocated: string;
  selling_price_per_unit: string;
  batch_number: string;
  created_at: string;
}

const recentSalesColumns: ColumnDef<RecentSale>[] = [
  {
    accessorKey: "seller_name",
    header: "SELLER",
    cell: ({ row }) => <span className="font-medium">{row.original.seller_name}</span>,
  },
  {
    accessorKey: "product_name",
    header: "PRODUCT",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.product_name}</span>,
  },
  {
    accessorKey: "batch_number",
    header: "BATCH",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.batch_number}</span>,
  },
  {
    accessorKey: "quantity_allocated",
    header: "QTY",
    cell: ({ row }) => <span>{row.original.quantity_allocated}</span>,
  },
  {
    accessorKey: "selling_price_per_unit",
    header: "PRICE",
    cell: ({ row }) => <span>₹{row.original.selling_price_per_unit}</span>,
  },
  {
    accessorKey: "created_at",
    header: "DATE",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.created_at ? format(new Date(row.original.created_at), "PP") : "—"}
      </span>
    ),
  },
];

function DashboardTable() {
  const { data, isLoading } = useDashboardData();

  const recentSales = data?.recent?.sales || [];

  return (
    <div>
      <div className="bg-white rounded-lg p-6 border rounded-br-none rounded-bl-none border-neutral-200 border-b-0">
        <div className="flex gap-2 items-center justify-between">
          <h2 className="text-[16px] font-medium text-neutral-500">
            Recent Sales Dispatches
          </h2>
          {isLoading ? (
            <Skeleton className="h-[48px] w-42 rounded-full" />
          ) : (
            <div className="px-4 py-3 bg-primary-50 text-primary shadow-none rounded-full font-medium">
              {recentSales.length} Orders
            </div>
          )}
        </div>
      </div>
      <DataTable
        columns={recentSalesColumns}
        data={recentSales}
        totalCount={recentSales.length}
        isLoading={isLoading}
        showPagination={false}
        className="rounded-tr-none rounded-tl-none border-t-none"
      />
      <SelectionActionBar
        allRows={recentSales}
        deleteName="Recent Sale"
        invalidateKeys={[["dashboardData"]]}
        deleteCallBack={() => Promise.resolve()}
      />
    </div>
  );
}

export default DashboardTable;
