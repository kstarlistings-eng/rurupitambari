import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";
import { Button } from "@/components/ui/button";
import { Download, Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router";

const STAFF_PAGE_TEXT = {
  title: "Service",
  description: "Organize and update service offerings",
  mobileDescription: "Organize and update service offerings",
  addButton: "Add Service",
} as const;

function ServicePageTop() {
  const navigate = useNavigate();
  return (
    <>
      <Page.HeaderLeftContainer className="min-[1360px]:w-auto w-full flex-wrap gap-y-2">
        <Page.HeaderContent>
          <Page.HeaderTitle>{STAFF_PAGE_TEXT.title}</Page.HeaderTitle>
          <Page.HeaderDescription className="sm:block hidden">
            {STAFF_PAGE_TEXT.description}
          </Page.HeaderDescription>
        </Page.HeaderContent>
        <div className="block min-[1360px]:hidden max-[360px]:ms-0 ms-auto">
          <Button variant={"default"} onClick={() => navigate("add")}>
            <Plus size={18} />
            {STAFF_PAGE_TEXT.addButton}
          </Button>
        </div>
        <Page.HeaderDescription className="sm:hidden block w-full">
          {STAFF_PAGE_TEXT.mobileDescription}
        </Page.HeaderDescription>
      </Page.HeaderLeftContainer>
      <Page.PageHeaderRightContainer className="w-full min-[1360px]:w-auto">
        <PageAction className="w-full min-[1360px]:w-auto min-h-[42px] min-[960px]:flex-nowrap flex-wrap">
          <PageAction.Search className="grow" />
          <div className="flex gap-2 items-center w-fit max-w-full flex-wrap sm:flex-nowrap">
            <PageAction.FilterSheet />
            <Button variant={"outline"}>
              <Download size={18} />
            </Button>
            <div id="portalFilterColumns" className="h-full" />
            <Button
              variant={"outline"}
              onClick={() => navigate("detail/manage-category")}
            >
              <Settings size={18} />
              Manage Category
            </Button>
          </div>
        </PageAction>
        <div className="hidden min-[1360px]:flex gap-2">
          <Button variant={"default"} onClick={() => navigate("add")}>
            <Plus size={18} />
            {STAFF_PAGE_TEXT.addButton}
          </Button>
        </div>
      </Page.PageHeaderRightContainer>
    </>
  );
}

export default ServicePageTop;
