import { createContext, useContext, type ReactNode } from "react";
import type { Table } from "@tanstack/react-table";

interface DataTableContextType<TData> {
  table: Table<TData> | null;
  totalCount: number;
  isLoading: boolean;
  data: TData[];
}

const DataTableContext = createContext<DataTableContextType<any> | undefined>(
  undefined,
);

interface DataTableProviderProps<TData> extends DataTableContextType<TData> {
  children: ReactNode;
}

export function DataTableProvider<TData>({
  children,
  table,
  totalCount,
  isLoading,
  data,
}: DataTableProviderProps<TData>) {
  return (
    <DataTableContext.Provider value={{ table, totalCount, isLoading, data }}>
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTable<TData>(): DataTableContextType<TData> {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error("useDataTable must be used within DataTableProvider");
  }
  return context as DataTableContextType<TData>;
}
