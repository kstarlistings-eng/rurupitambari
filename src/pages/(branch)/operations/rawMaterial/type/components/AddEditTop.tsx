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

function AddEditTop({ onSave, onCancel, isPending, isEditMode }: Props) {
  const navigate = useNavigate();
  const sendBack = () => {
    onCancel?.();
    navigate("/raw-material");
  };

  const HeaderText = {
    title: isEditMode ? "Edit Material" : "Add New Material",
    description: "Manage all raw material details",
    btnName: "Save Changes",
  };
  return (
    <>
      <Page.HeaderLeftContainer>
        <Page.Back onClick={() => sendBack()} />
        <Page.HeaderContent className="text-xl font-semibold">
          <Page.HeaderTitle>{HeaderText?.title || "N/A"}</Page.HeaderTitle>
          <Page.HeaderDescription className="sm:block hidden">
            {HeaderText?.description || "N/A"}
          </Page.HeaderDescription>
        </Page.HeaderContent>
      </Page.HeaderLeftContainer>
      <Page.PageHeaderRightContainer>
        <PageAction>
          <div className="flex items-center gap-3">
            {/* Save button */}
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
    </>
  );
}

export default AddEditTop;
