import { Page } from "@/components/layout/page/PageLayout";
import ProductAddEditTop from "./components/ProductAddEditTop";
import ProductForm from "./components/ProductForm";
import useProductFormActions from "./useProductFormActions";
import { Loader } from "lucide-react";

function ProductAddEditPage() {
  const {
    data: { isLoading },
    form,
    onSubmit,
    isEditMode,
    isPending,
  } = useProductFormActions();

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
          <ProductAddEditTop
            onSave={form.handleSubmit(onSubmit)}
            isPending={isPending}
            isEditMode={isEditMode}
          />
        </Page.Header>
        <Page.Content>
          <ProductForm form={form} />
        </Page.Content>
      </Page.FormContainer>
    </Page>
  );
}

export default ProductAddEditPage;
