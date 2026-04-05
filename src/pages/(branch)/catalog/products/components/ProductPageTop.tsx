import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Plus, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router";

const STAFF_PAGE_TEXT = {
  title: "Products",
  description: "Organize and update products.",
  mobileDescription: "Organize and update products.",
  addButton: "Add Product",
} as const;

function ProductPageTop() {
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  <Settings size={18} />
                  Manage Setup
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="py-2">
                <DropdownMenuItem className="px-4 rounded-sm py-2 cursor-pointer">
                  <Link to="detail/setup-batch">Batch Setup</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 rounded-sm py-2 cursor-pointer">
                  <Link to="detail/setup-category">Category Setup</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

export default ProductPageTop;
