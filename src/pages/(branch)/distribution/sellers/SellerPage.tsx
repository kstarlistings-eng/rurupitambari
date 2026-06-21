import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { salesEndpoints } from "@/config/endpoints";
import { sellerKeys } from "@/config/querykeys/(branchKeys)/salesKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { useQuery } from "@tanstack/react-query";
import { sellerColumns } from "./components/SellerColumn";
import SellerPageTop from "./components/SellerPageTop";
import type { Seller } from "@/schema/(branchSchema)/distribution/seller";

const deleteDialogText = {
  title: "Permanently Delete Sellers",
  description:
    "This will remove the selected seller records. This action cannot be undone.",
  btnName: "Confirm Delete",
};

function SellerPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<Seller & { id: string }>>({
    queryKey: [sellerKeys.ALL_SELLERS, params],
    queryFn: async () => {
      return await authInstance.get(salesEndpoints.SELLERS, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const sellers = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <SellerPageTop />
      </Page.Header>

      <Page.Content>
        <DataTable
          columns={sellerColumns}
          data={sellers}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<Seller & { id: string }>
        deleteCallBack={(data) => {
          return Promise.all(
            data.map((item) =>
              authInstance.delete(`${salesEndpoints.SELLERS}${item.id}/`)
            )
          );
        }}
        dialogText={deleteDialogText}
        confirmText="Delete all"
        allRows={sellers}
        invalidateKeys={[sellerKeys.ALL_SELLERS]}
        deleteName="Seller"
      />
    </Page>
  );
}

export default SellerPage;
