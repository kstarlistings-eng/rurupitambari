import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

const STAFF_PAGE_TEXT = {
  title: "Material Management",
  description: "Manage all material inventory",
  mobileDescription: "Manage all material inventory",
  addButton: "Add Material",
} as const;

function StaffPageTop() {
  const navigate = useNavigate();
  return (
    <>
      <Page.HeaderLeftContainer className="min-[1170px]:w-auto w-full flex-wrap gap-y-2">
        <Page.HeaderContent>
          <Page.HeaderTitle>{STAFF_PAGE_TEXT.title}</Page.HeaderTitle>
          <Page.HeaderDescription className="sm:block hidden">
            {STAFF_PAGE_TEXT.description}
          </Page.HeaderDescription>
        </Page.HeaderContent>
        <div className="block min-[1170px]:hidden max-[360px]:ms-0 ms-auto">
          <Button variant={"default"} onClick={() => navigate("add")}>
            {STAFF_PAGE_TEXT.addButton}
          </Button>
        </div>
        <Page.HeaderDescription className="sm:hidden block w-full">
          {STAFF_PAGE_TEXT.mobileDescription}
        </Page.HeaderDescription>
      </Page.HeaderLeftContainer>
      <Page.PageHeaderRightContainer className="w-full min-[1170px]:w-auto">
        <PageAction className="w-full min-[1170px]:w-auto min-h-[42px] sm:flex-nowrap flex-wrap">
          <PageAction.Search />
          <div className="flex gap-2 items-center w-full">
            <PageAction.FilterSheet />
            <div id="portalFilterColumns" className="h-full" />
          </div>
        </PageAction>
        <div className="hidden min-[1170px]:flex gap-2">
          <Button variant={"default"} onClick={() => navigate("add")}>
            <Plus size={18} />
            {STAFF_PAGE_TEXT.addButton}
          </Button>
        </div>
      </Page.PageHeaderRightContainer>
    </>
  );
}

export default StaffPageTop;
