import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ColumnDef,
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryState, parseAsInteger } from "nuqs";
import { useSelectionStore } from "@/store/selection-store";
import { DataTableProvider } from "./useDataTable";
import ColumnConfigure from "./column-configure";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  limit?: number;
  isLoading?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  className?: string;
}

function getPaginationRange(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  const pages: (number | "...")[] = [];
  pages.push(0);

  if (currentPage > 2) {
    pages.push("...");
  }

  const start = Math.max(1, currentPage - 1);
  const end = Math.min(totalPages - 2, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 3) {
    pages.push("...");
  }

  pages.push(totalPages - 1);

  return pages;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  limit: defaultLimit = 8,
  isLoading = false,
  showPagination = true,
  className,
}: DataTableProps<TData, TValue>) {
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(defaultLimit).withOptions({ history: "push" }),
  );
  const [offset, setOffset] = useQueryState(
    "offset",
    parseAsInteger.withDefault(0).withOptions({ history: "push" }),
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const totalPages = Math.ceil(totalCount / limit);
  const currentPageIndex = Math.floor(offset / limit);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: currentPageIndex,
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: currentPageIndex, pageSize: limit })
          : updater;
      void setOffset(next.pageIndex * limit);
      if (next.pageSize !== limit) {
        void setLimit(next.pageSize);
        void setOffset(0);
      }
    },
  });

  const currentPage = table.getState().pagination.pageIndex;
  const paginationRange = getPaginationRange(currentPage, totalPages);

  const { setSelectedRows, clearSelection, selectedRows } = useSelectionStore();

  React.useEffect(() => {
    const selected = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setSelectedRows(selected);
  }, [rowSelection, setSelectedRows, table]);

  React.useEffect(() => {
    const currentTableSelection = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    // Only update if selectedRows differs from what's currently in the table
    const isSynced =
      currentTableSelection.length === selectedRows.length &&
      currentTableSelection.every((item) => selectedRows.includes(item));

    if (isSynced) return; // Already in sync, don't update

    if (selectedRows.length === 0) {
      setRowSelection({});
    } else {
      const newRowSelection: Record<string, boolean> = {};
      table.getRowModel().rows.forEach((row) => {
        if (selectedRows.includes(row.original)) {
          newRowSelection[row.id] = true;
        }
      });
      setRowSelection(newRowSelection);
    }
  }, [selectedRows, table]);

  React.useEffect(() => {
    return () => clearSelection();
  }, [clearSelection]);

  return (
    <DataTableProvider
      data={data}
      totalCount={totalCount}
      isLoading={isLoading}
      table={table}
    >
      <ColumnConfigure table={table} />
      <div className="space-y-4">
        <div
          className={cn(
            "rounded-[12px] border  overflow-hidden border-neutral-200 bg-white",
            className,
          )}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-neutral-200 bg-neutral-100"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs font-medium uppercase text-neutral-500 px-4 py-3"
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
                Array.from({ length: defaultLimit }).map((_, rowIdx) => (
                  <TableRow
                    key={`skeleton-${rowIdx}`}
                    className="border-neutral-200"
                  >
                    {columns.map((_, colIdx) => (
                      <TableCell
                        key={`skeleton-${rowIdx}-${colIdx}`}
                        className="px-4 py-3"
                      >
                        <Skeleton className="h-8 w-full rounded-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-neutral-200"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3">
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
                    className="h-100 text-center font-semibold text-neutral-500 text-xl"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination — only show if more than 1 page */}
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 py-2 w-fit mx-auto bg-white rounded-[10px] px-3">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer",
                "text-neutral-500 hover:text-neutral-800 hover:bg-primary-50",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-500",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-1 mx-1">
              {paginationRange.map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-sm text-neutral-400 select-none"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => table.setPageIndex(page as number)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors cursor-pointer",
                      currentPage === page
                        ? "bg-primary-50 text-primary"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
                    )}
                  >
                    {String((page as number) + 1).padStart(2, "0")}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer",
                "text-neutral-500 hover:text-neutral-800 hover:bg-primary-50",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-500",
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </DataTableProvider>
  );
}
