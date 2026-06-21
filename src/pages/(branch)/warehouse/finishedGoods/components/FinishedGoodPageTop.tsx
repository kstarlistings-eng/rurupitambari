import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";

const FINISHED_GOOD_PAGE_TEXT = {
  title: "Finished Goods / Store",
  description: "Manage all finished goods inventory",
  mobileDescription: "Manage all finished goods inventory",
} as const;

function FinishedGoodPageTop() {
  return (
    <>
      <Page.HeaderLeftContainer className="min-[1170px]:w-auto w-full flex-wrap gap-y-2">
        <Page.HeaderContent>
          <Page.HeaderTitle>{FINISHED_GOOD_PAGE_TEXT.title}</Page.HeaderTitle>
          <Page.HeaderDescription className="sm:block hidden">
            {FINISHED_GOOD_PAGE_TEXT.description}
          </Page.HeaderDescription>
        </Page.HeaderContent>
        <Page.HeaderDescription className="sm:hidden block w-full">
          {FINISHED_GOOD_PAGE_TEXT.mobileDescription}
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
      </Page.PageHeaderRightContainer>
    </>
  );
}

export default FinishedGoodPageTop;
