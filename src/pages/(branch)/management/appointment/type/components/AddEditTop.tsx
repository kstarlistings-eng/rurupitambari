import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

type Props = {
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
  type: string | undefined;
};

const HeaderText = {
  title: "Appointment",
  description: "Manage all studio appointments",
  btnName: "Save Changes",
};


function AddEditTop({ onSave, onCancel, isPending, type }: Props) {
  console.log("this is the type in top", type);
  const navigate = useNavigate();
  const sendBack = () => {
    onCancel();
    navigate("/appointments");
  };
  return (
    <>
      <Page.HeaderLeftContainer>
        <Page.Back onClick={() => sendBack()} />
        <Page.HeaderContent className="text-xl font-semibold">
          <Page.HeaderTitle><span className="capitalize">{type}</span> {HeaderText?.title || "N/A"}</Page.HeaderTitle>
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
              
              {isPending ? "Saving..." : HeaderText?.btnName}
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
