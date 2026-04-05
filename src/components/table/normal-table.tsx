import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type NormalTableProps<TData, TValue> = {
  data?: TData[];
  isLoading?: boolean;
  columns: ColumnDef<TData, TValue>[];
  className?: string;
  limit?: number;
};

export default function NormalTable<TData, TValue>({
  data,
  isLoading,
  columns,
  className,
  limit = 4,
}: NormalTableProps<TData, TValue>) {
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={cn("bg-white overflow-hidden", className)}>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-neutral-200 bg-white hover:bg-white"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 px-5 py-3"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, rowIdx) => (
                <TableRow
                  key={`skeleton-${rowIdx}`}
                  className="border-neutral-200"
                >
                  {columns.map((_, colIdx) => (
                    <TableCell
                      key={`skeleton-${rowIdx}-${colIdx}`}
                      className="px-5 py-4"
                    >
                      <Skeleton className="h-4 w-full rounded-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center font-semibold text-neutral-400 text-base"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
