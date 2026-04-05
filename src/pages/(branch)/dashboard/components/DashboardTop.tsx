import { Page } from "@/components/layout/page/PageLayout";

function DashboardTop() {
  return (
    <Page.Header>
      <Page.HeaderLeftContainer>
        <Page.HeaderContent>
          <Page.HeaderTitle>Dashboard</Page.HeaderTitle>
          <Page.HeaderDescription>
            Welcome back! Here's what's happening with your platform today.
          </Page.HeaderDescription>
        </Page.HeaderContent>
      </Page.HeaderLeftContainer>
    </Page.Header>
  );
}

export default DashboardTop;
