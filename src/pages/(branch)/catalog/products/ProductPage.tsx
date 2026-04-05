import { Page } from "@/components/layout/page/PageLayout";
import ProductPageTop from "./components/ProductPageTop";
import { DataTable } from "@/components/table/data-table";
import { productColumns } from "./components/ProductColumn";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import type { Product } from "@/types/(branch)/catalog/product";
import { authInstance } from "@/config/axios-interceptor";
import { productKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import { branchEndpoints } from "@/config/endpoints";
import { useQuery } from "@tanstack/react-query";

function ProductPage() {
  const { data, isLoading } = useQuery<PaginatedResponse<Product>>({
    queryKey: [productKeys.ALL_PRODUCTS],
    queryFn: async () => {
      return await authInstance.get(`${branchEndpoints.PRODUCTS}`);
    },
  });
  const products = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <ProductPageTop />
      </Page.Header>
      <Page.Content>
        <DataTable
          columns={productColumns}
          data={products}
          isLoading={isLoading}
          totalCount={data?.count || 0}
        />
      </Page.Content>
      <SelectionActionBar<Product>
        deleteCallBack={(data) => {
          console.log("Delete these products: ", data);
        }}
        dialogText={{
          title: "Permanently Delete Products",
          description:
            "This will remove the products permanently. This action cannot be undone.",
          btnName: "Confirm Delete",
        }}
        allRows={products}
      />
    </Page>
  );
}

export default ProductPage;
