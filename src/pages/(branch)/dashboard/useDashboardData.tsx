import { authInstance } from "@/config/axios-interceptor";
// import { endpoints } from "@/config/endpoints";
import type { DashboardData } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useDashboardData = () => {
  const data = useQuery<any>({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      // return await authInstance.get(endpoints.DASHBOARD);
      return await Promise.resolve({
        count: 0,
        results: [],
        stats: {},
        charts: [],
      });
    },
  });
  return data;
};
