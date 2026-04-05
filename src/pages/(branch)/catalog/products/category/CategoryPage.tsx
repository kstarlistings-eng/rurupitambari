import { Page } from "@/components/layout/page/PageLayout";
import CategoryTop from "./components/ProductCategoryTop";
import { branchEndpoints } from "@/config/endpoints";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { productKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import { authInstance } from "@/config/axios-interceptor";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/data-table";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import type { ProductCategory } from "@/types/(branch)/catalog/product";
import { productCategoryColumns } from "./components/ProductCategoryColumn";

function ProductCategoryPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<ProductCategory>>({
    queryKey: [productKeys.PRODUCT_CATEGORY_LIST, params],
    queryFn: async () => {
      return await authInstance.get(branchEndpoints.PRODUCT_CATEGORIES, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const categories = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <CategoryTop />
      </Page.Header>
      <Page.Content>
        <DataTable
          columns={productCategoryColumns}
          data={categories}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>
      <SelectionActionBar<ProductCategory>
        deleteCallBack={(data) => {
          return authInstance.post(`${branchEndpoints.BULKDELETE}`, {
            object_ids: data.map((item) => item.id),
            model: "branch.ProductCategory",
          });
        }}
        dialogText={{
          title: "Permanently Delete Categories",
          description:
            "This will remove the product category and all related products. This action cannot be undone.",
          btnName: "Confirm Delete",
        }}
        allRows={categories}
        invalidateKeys={[productKeys.PRODUCT_CATEGORY_LIST]}
        deleteName="Categories"
      />
    </Page>
  );
}

export default ProductCategoryPage;
