import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router";

type Props = {
  onSave: () => void;
  onCancel?: () => void;
  isPending: boolean;
  isEditMode: boolean;
};

function ProductAddEditTop({ onSave, onCancel, isPending, isEditMode }: Props) {
  const navigate = useNavigate();
  const sendBack = () => {
    onCancel?.();
    navigate("/catalog/products");
  };

  const HeaderText = {
    title: isEditMode ? "Edit Product" : "Add Product",
    description: "Set up new products in a second.",
    btnName: "Save Changes",
  };
  return (
    <>
      <Page.HeaderLeftContainer>
        <Page.Back onClick={() => sendBack()} />
        <Page.HeaderContent>
          <Page.HeaderTitle>{HeaderText?.title || "N/A"}</Page.HeaderTitle>
          <Page.HeaderDescription>
            {HeaderText?.description || "N/A"}
          </Page.HeaderDescription>
        </Page.HeaderContent>
      </Page.HeaderLeftContainer>
      <Page.PageHeaderRightContainer className="md:block hidden">
        <PageAction>
          <div className="flex items-center gap-3">
            <Button
              variant={"default"}
              onClick={() => onSave()}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={14} /> {"Saving..."}
                </>
              ) : (
                HeaderText?.btnName
              )}
            </Button>
            <Button variant={"outline"} onClick={() => sendBack()}>
              Cancel
            </Button>
          </div>
        </PageAction>
      </Page.PageHeaderRightContainer>

      <div className="fixed bottom-0 right-0 w-full bg-white flex justify-center py-8 px-6 z-50 md:hidden">
        <PageAction>
          <div className="flex items-center gap-3">
            <Button
              variant={"default"}
              onClick={() => onSave()}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={14} /> {"Saving..."}
                </>
              ) : (
                HeaderText?.btnName
              )}
            </Button>
            <Button variant={"outline"} onClick={() => sendBack()}>
              Cancel
            </Button>
          </div>
        </PageAction>
      </div>
    </>
  );
}

export default ProductAddEditTop;
