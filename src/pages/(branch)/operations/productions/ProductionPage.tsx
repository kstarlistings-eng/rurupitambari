import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { productionKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { useQuery } from "@tanstack/react-query";
import { productionColumns } from "./components/ProductionColumn";
import ProductionPageTop from "./components/ProductionPageTop";
type ProductionOrderRow = {
  id: string;
  batch_number: string;
  product_name: string;
  quantity_produced: number;
  production_date: string;
  shift: string;
  supervisor_name: string;
  machine_line_number: string;
  status: string;
};

const deleteDialogText = {
  title: "Permanently Delete Production Order",
  description:
    "This will remove the production order and all related records. This action cannot be undone.",
  btnName: "Confirm Delete",
};

function ProductionPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<ProductionOrderRow>>({
    queryKey: [productionKeys.ALL_PRODUCTION_ORDERS, params],
    queryFn: async () => {
      return await authInstance.get(operationsEndpoints.PRODUCTION_ORDERS, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const productions = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <ProductionPageTop />
      </Page.Header>

      <Page.Content>
        <DataTable
          columns={productionColumns}
          data={productions}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<ProductionOrderRow>
        deleteCallBack={(data) => {
          return Promise.all(
            data.map((item) =>
              authInstance.delete(`${operationsEndpoints.PRODUCTION_ORDERS}${item.id}/`)
            )
          );
        }}
        dialogText={deleteDialogText}
        confirmText="Delete all"
        allRows={productions}
        invalidateKeys={[productionKeys.ALL_PRODUCTION_ORDERS]}
        deleteName="Production Order"
      />
    </Page>
  );
}

export default ProductionPage;
