import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import {
  finishedGoodKeys,
  transferKeys,
} from "@/config/querykeys/(branchKeys)/operationsKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transferColumns, type Transfer } from "./components/TransferColumn";
import TransferPageTop from "./components/TransferPageTop";
import { notify } from "@/components/toast/NotifyToast";

const deleteDialogText = {
  title: "Permanently Delete Transfers",
  description:
    "This will remove the selected transfer records. This action cannot be undone.",
  btnName: "Confirm Delete",
};

function TransferPage() {
  const queryClient = useQueryClient();
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<Transfer>>({
    queryKey: [transferKeys.ALL_TRANSFERS, params],
    queryFn: async () => {
      return await authInstance.get(operationsEndpoints.TRANSFERS, {
        params: {
          ...params,
          status: "pending",
          limit: 8,
        },
      });
    },
  });

  const receiveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await authInstance.patch(
        `${operationsEndpoints.TRANSFERS}${id}/receive/`,
        {},
      );
    },
    onSuccess: () => {
      notify({
        title: "Transfer Received",
        message: "The transfer has been received successfully.",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: [transferKeys.ALL_TRANSFERS] });
      queryClient.invalidateQueries({
        queryKey: [finishedGoodKeys.ALL_FINISHED_GOODS],
      });
    },
    onError: (error) => {
      notify({
        title: "Error Receiving Transfer",
        message:
          error?.message ||
          "There was an error receiving the transfer. Please try again.",
        variant: "error",
      });
    },
  });

  const transfers = data?.results || [];
  const columns = transferColumns(
    (id) => receiveMutation.mutate(id),
    receiveMutation.isPending,
  );

  return (
    <Page>
      <Page.Header>
        <TransferPageTop />
      </Page.Header>

      <Page.Content>
        <DataTable
          columns={columns}
          data={transfers}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<Transfer>
        deleteCallBack={(data) => {
          return Promise.all(
            data.map((item) =>
              authInstance.delete(`${operationsEndpoints.TRANSFERS}${item.id}/`)
            )
          );
        }}
        dialogText={deleteDialogText}
        confirmText="Delete all"
        allRows={transfers}
        invalidateKeys={[transferKeys.ALL_TRANSFERS]}
        deleteName="Transfer"
      />
    </Page>
  );
}

export default TransferPage;
