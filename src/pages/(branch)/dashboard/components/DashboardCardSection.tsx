import {
  Building2Icon,
  Calendar,
  Clock4Icon,
  PauseCircleIcon,
  UserCheck2Icon,
  Users2Icon,
} from "lucide-react";
import DashboardCard, { DashboardCardSkeleton } from "./DashboardCard";
import { useDashboardData } from "../useDashboardData";

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
            title={"Raw Materails Data"}
            value={stats?.organizations?.total || 0}
            icon={
              <Building2Icon
                className="p-2 text-primary bg-primary-50 rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title={"Production Data"}
            value={stats?.organizations?.active || 0}
            icon={
              <UserCheck2Icon
                className="p-2 text-success-500 bg-success-50 rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title={"Store Data"}
            value={stats?.organizations?.trial || 0}
            icon={
              <Calendar
                className="p-2 text-warning-500 bg-warning-50 rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title={"Stock Data"}
            value={stats?.organizations?.suspended || 0}
            icon={
              <PauseCircleIcon
                className="p-2 text-destructive-500 bg-destructive-50 rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title={"Market Data"}
            value={stats?.users?.total || 0}
            icon={
              <Users2Icon
                className="p-2 text-[#0EA5E9] bg-[#F0F9FF] rounded-lg"
                size={48}
              />
            }
          />
          <DashboardCard
            title={"Earnings Data"}
            value={stats?.organizations?.expiring_soon || 0}
            icon={
              <Clock4Icon
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
