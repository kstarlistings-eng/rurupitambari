import { Page } from "@/components/layout/page/PageLayout";
import BatchTop from "./components/ProductBatchTop";
import { branchEndpoints } from "@/config/endpoints";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { productKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import { authInstance } from "@/config/axios-interceptor";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/data-table";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import type { ProductBatch } from "@/types/(branch)/catalog/product";
import { productBatchColumns } from "./components/ProductBatchColumn";

function ProductBatchPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<ProductBatch>>({
    queryKey: [productKeys.PRODUCT_BATCH_LIST, params],
    queryFn: async () => {
      return await authInstance.get(branchEndpoints.PRODUCT_BATCHES, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const batches = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <BatchTop />
      </Page.Header>
      <Page.Content>
        <DataTable
          columns={productBatchColumns}
          data={batches}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>
      <SelectionActionBar<ProductBatch>
        deleteCallBack={(data) => {
          return authInstance.post(`${branchEndpoints.BULKDELETE}`, {
            object_ids: data.map((item) => item.id),
            model: "branch.ProductBatch",
          });
        }}
        dialogText={{
          title: "Permanently Delete Batches",
          description:
            "This will remove the product batch and all related products. This action cannot be undone.",
          btnName: "Confirm Delete",
        }}
        allRows={batches}
        invalidateKeys={[productKeys.PRODUCT_BATCH_LIST]}
        deleteName="Batches"
      />
    </Page>
  );
}

export default ProductBatchPage;
