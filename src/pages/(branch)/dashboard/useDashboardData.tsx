import { authInstance } from "@/config/axios-interceptor";
import { dashboardEndpoints } from "@/config/endpoints";
import { useQuery } from "@tanstack/react-query";

export interface DashboardData {
  stats: {
    raw_materials: { count: number; total_quantity: number };
    expenses: { count: number; total_value: number };
    production: { count: number; total_quantity: number };
    pending_transfers: { count: number };
    finished_goods: { count: number; total_quantity: number };
    sellers: { count: number };
    sales_dispatches: { count: number; total_value: number };
    invoices: { count: number; total_value: number };
  };
  recent: {
    expenses: any[];
    production: any[];
    sales: any[];
  };
  charts: {
    monthly_sales: { month: string; total: number }[];
    monthly_expenses: { month: string; total: number }[];
  };
}

export const useDashboardData = () => {
  const data = useQuery<DashboardData>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      return await authInstance.get(dashboardEndpoints.DASHBOARD);
    },
  });
  return data;
};
