import { create } from "zustand";

interface SelectionStore<T = unknown> {
  selectedRows: T[];
  setSelectedRows: (rows: T[]) => void;
  clearSelection: () => void;
}

export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedRows: [],
  setSelectedRows: (rows) => set({ selectedRows: rows }),
  clearSelection: () => set({ selectedRows: [] }),
}));
