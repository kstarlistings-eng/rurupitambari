import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";
import { useNavigate } from "react-router";
import ServiceCategoryForm from "./ServiceCategoryForm";

const STAFF_PAGE_TEXT = {
  title: "Category",
  description: "Manage all studio's categories",
  mobileDescription: "Manage all studio's categories",
} as const;

function CategoryTop() {
  const navigate = useNavigate();
  return (
    <>
      <Page.HeaderLeftContainer className="min-[1170px]:w-auto w-full flex-wrap gap-y-2">
        <Page.Back onClick={() => navigate("/catalog/services")} />

        <Page.HeaderContent>
          <Page.HeaderTitle>{STAFF_PAGE_TEXT.title}</Page.HeaderTitle>
          <Page.HeaderDescription className="sm:block hidden">
            {STAFF_PAGE_TEXT.description}
          </Page.HeaderDescription>
        </Page.HeaderContent>
        <div className="block min-[1170px]:hidden max-[360px]:ms-0 ms-auto">
          <ServiceCategoryForm />
        </div>
        <Page.HeaderDescription className="sm:hidden block w-full">
          {STAFF_PAGE_TEXT.mobileDescription}
        </Page.HeaderDescription>
      </Page.HeaderLeftContainer>
      <Page.PageHeaderRightContainer className="w-full min-[1170px]:w-auto">
        <PageAction className="w-full min-[1170px]:w-auto min-h-[42px] sm:flex-nowrap flex-wrap">
          <PageAction.Search />
        </PageAction>
        <div className="hidden min-[1170px]:flex gap-2">
          <ServiceCategoryForm />
        </div>
      </Page.PageHeaderRightContainer>
    </>
  );
}

export default CategoryTop;
