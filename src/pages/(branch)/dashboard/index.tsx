import { Page } from "@/components/layout/page/PageLayout";
import DashboardTop from "./components/DashboardTop";
import DashboardCardSection from "./components/DashboardCardSection";
import DashboardGraphSection from "./components/DashboardGraphSection";
import DashboardTable from "./components/DashboardTable";

function DashBoardPage() {
  return (
    <Page>
      <DashboardTop />
      <DashboardCardSection />
      <DashboardGraphSection />
      <DashboardTable />
    </Page>
  );
}

export default DashBoardPage;
