import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { salesEndpoints } from "@/config/endpoints";
import { salesDispatchKeys } from "@/config/querykeys/(branchKeys)/salesKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { useQuery } from "@tanstack/react-query";
import { salesDispatchColumns, type SalesDispatchRow } from "./components/SalesDispatchColumn";
import SalesDispatchPageTop from "./components/SalesDispatchPageTop";

const deleteDialogText = {
  title: "Permanently Delete Sales Dispatches",
  description:
    "This will remove the selected sales dispatch records. This action cannot be undone.",
  btnName: "Confirm Delete",
};

function SalesDispatchPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<SalesDispatchRow>>({
    queryKey: [salesDispatchKeys.ALL_SALES_DISPATCHES, params],
    queryFn: async () => {
      return await authInstance.get(salesEndpoints.SALES_DISPATCHES, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const salesDispatches = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <SalesDispatchPageTop />
      </Page.Header>

      <Page.Content>
        <DataTable
          columns={salesDispatchColumns}
          data={salesDispatches}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<SalesDispatchRow>
        deleteCallBack={(data) => {
          return Promise.all(
            data.map((item) =>
              authInstance.delete(`${salesEndpoints.SALES_DISPATCHES}${item.id}/`)
            )
          );
        }}
        dialogText={deleteDialogText}
        confirmText="Delete all"
        allRows={salesDispatches}
        invalidateKeys={[salesDispatchKeys.ALL_SALES_DISPATCHES]}
        deleteName="Sales Dispatch"
      />
    </Page>
  );
}

export default SalesDispatchPage;
