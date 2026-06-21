import {
  Building2Icon,
  PackageIcon,
  StoreIcon,
  TruckIcon,
  UsersIcon,
  CreditCardIcon,
} from "lucide-react";
import DashboardCard, { DashboardCardSkeleton } from "./DashboardCard";
import { useDashboardData } from "../useDashboardData";

function formatNumber(num: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(num);
}

function DashboardCardSection() {
  const { data, isLoading } = useDashboardData();
  const stats = data?.stats;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <DashboardCardSkeleton key={index} />
        ))
      ) : (
        <>
          <DashboardCard
            title="Raw Materials"
            value={stats?.raw_materials?.count || 0}
            subtitle={`${formatNumber(stats?.raw_materials?.total_quantity || 0)} in stock`}
            icon={
              <Building2Icon
                className="p-2 text-primary bg-primary-50 rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title="Production Orders"
            value={stats?.production?.count || 0}
            subtitle={`${formatNumber(stats?.production?.total_quantity || 0)} produced`}
            icon={
              <PackageIcon
                className="p-2 text-success-500 bg-success-50 rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title="Finished Goods"
            value={stats?.finished_goods?.count || 0}
            subtitle={`${formatNumber(stats?.finished_goods?.total_quantity || 0)} in store`}
            icon={
              <StoreIcon
                className="p-2 text-warning-500 bg-warning-50 rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title="Pending Transfers"
            value={stats?.pending_transfers?.count || 0}
            subtitle="awaiting receipt"
            icon={
              <TruckIcon
                className="p-2 text-destructive-500 bg-destructive-50 rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title="Sellers"
            value={stats?.sellers?.count || 0}
            subtitle="active dealers"
            icon={
              <UsersIcon
                className="p-2 text-[#0EA5E9] bg-[#F0F9FF] rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title="Total Sales"
            value={`₹${formatNumber(stats?.invoices?.total_value || 0)}`}
            subtitle={`${stats?.invoices?.count || 0} invoices`}
            icon={
              <CreditCardIcon
                className="p-2 text-[#7C3AED] bg-[#F5F3FF] rounded-lg"
                size={48}
              />
            }
          />
        </>
      )}
    </div>
  );
}

export default DashboardCardSection;
