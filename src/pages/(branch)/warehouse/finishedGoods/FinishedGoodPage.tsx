import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { finishedGoodKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { useQuery } from "@tanstack/react-query";
import { finishedGoodColumns, type FinishedGood } from "./components/FinishedGoodColumn";
import FinishedGoodPageTop from "./components/FinishedGoodPageTop";

const deleteDialogText = {
  title: "Permanently Delete Finished Goods",
  description:
    "This will remove the selected finished good records. This action cannot be undone.",
  btnName: "Confirm Delete",
};

function FinishedGoodPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<FinishedGood>>({
    queryKey: [finishedGoodKeys.ALL_FINISHED_GOODS, params],
    queryFn: async () => {
      return await authInstance.get(operationsEndpoints.FINISHED_GOODS, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const finishedGoods = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <FinishedGoodPageTop />
      </Page.Header>

      <Page.Content>
        <DataTable
          columns={finishedGoodColumns}
          data={finishedGoods}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<FinishedGood>
        deleteCallBack={(data) => {
          return Promise.all(
            data.map((item) =>
              authInstance.delete(`${operationsEndpoints.FINISHED_GOODS}${item.id}/`)
            )
          );
        }}
        dialogText={deleteDialogText}
        confirmText="Delete all"
        allRows={finishedGoods}
        invalidateKeys={[finishedGoodKeys.ALL_FINISHED_GOODS]}
        deleteName="Finished Good"
      />
    </Page>
  );
}

export default FinishedGoodPage;
