import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

const SELLER_PAGE_TEXT = {
  title: "Seller Management",
  description: "Manage all sellers and dealers",
  mobileDescription: "Manage all sellers and dealers",
  addButton: "Add Seller",
} as const;

function SellerPageTop() {
  const navigate = useNavigate();
  return (
    <>
      <Page.HeaderLeftContainer className="min-[1170px]:w-auto w-full flex-wrap gap-y-2">
        <Page.HeaderContent>
          <Page.HeaderTitle>{SELLER_PAGE_TEXT.title}</Page.HeaderTitle>
          <Page.HeaderDescription className="sm:block hidden">
            {SELLER_PAGE_TEXT.description}
          </Page.HeaderDescription>
        </Page.HeaderContent>
        <div className="block min-[1170px]:hidden max-[360px]:ms-0 ms-auto">
          <Button variant={"default"} onClick={() => navigate("add")}>
            {SELLER_PAGE_TEXT.addButton}
          </Button>
        </div>
        <Page.HeaderDescription className="sm:hidden block w-full">
          {SELLER_PAGE_TEXT.mobileDescription}
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
            {SELLER_PAGE_TEXT.addButton}
          </Button>
        </div>
      </Page.PageHeaderRightContainer>
    </>
  );
}

export default SellerPageTop;
