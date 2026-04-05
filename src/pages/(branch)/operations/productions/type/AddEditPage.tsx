import { Page } from "@/components/layout/page/PageLayout";
import AddEditTop from "./components/AddEditTop";
import StaffForm from "./components/StaffForm";
import useProductionFormActions from "./useProductionFormActions";
import { Loader } from "lucide-react";

function AddEditPage() {
  const {
    data: { isLoading },
    form,
    onSubmit,
    isEditMode,
    isPending,
  } = useProductionFormActions();
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <Page>
      <Page.FormContainer className="flex-col flex gap-15 pb-10">
        <Page.Header>
          <AddEditTop
            onSave={form.handleSubmit(onSubmit)}
            isPending={isPending}
            isEditMode={isEditMode}
          />
        </Page.Header>
        <Page.Content>
          <StaffForm form={form}/>
        </Page.Content>
      </Page.FormContainer>
    </Page>
  );
}

export default AddEditPage;
