import OrganizationGrowthChart from "./graph/OrgGrowth";
import MonthlyGrowthChart from "./graph/OrgUser";

function DashboardGraphSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <OrganizationGrowthChart />
      <MonthlyGrowthChart />
    </div>
  );
}

export default DashboardGraphSection;
