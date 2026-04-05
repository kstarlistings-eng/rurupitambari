import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function CustomerPageTop() {
  const navigate = useNavigate();
  return (
    <>
      <Page.HeaderLeftContainer className="min-[1170px]:w-auto w-full flex-wrap gap-y-2">
        <Page.HeaderContent>
          <Page.HeaderTitle>Customer</Page.HeaderTitle>
          <Page.HeaderDescription className="sm:block hidden">
            Manage all studio's customers
          </Page.HeaderDescription>
        </Page.HeaderContent>
        <div className="block min-[1170px]:hidden max-[360px]:ms-0 ms-auto">
          {/* Add button */}
          <Button variant={"default"} onClick={() => navigate("add")}>
            Add Customer
          </Button>
        </div>
        <Page.HeaderDescription className="sm:hidden block w-full">
          Manage all studio's customers
        </Page.HeaderDescription>
      </Page.HeaderLeftContainer>
      <Page.PageHeaderRightContainer className="w-full min-[1170px]:w-auto">
        <PageAction className="w-full min-[1170px]:w-auto min-h-[42px] sm:flex-nowrap flex-wrap">
          <PageAction.Search />
          <div className="flex gap-2 items-center w-full">
            <PageAction.Filter
              filterKey="is_active"
              placeHolder="Filter by status"
              className="!h-full sm:w-38 grow"
              options={[
                { label: "All Customers", value: "" },
                { label: "Active", value: "true" },
                { label: "Inactive", value: "false" },
              ]}
            />
            <div id="portalFilterColumns" className="h-full" />
          </div>
        </PageAction>
        <div className="hidden min-[1170px]:flex gap-2">
          {/* Add button */}
          <Button variant={"default"} onClick={() => navigate("add")}>
            Add Customer
          </Button>
        </div>
      </Page.PageHeaderRightContainer>
    </>
  );
}

export default CustomerPageTop;
