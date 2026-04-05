import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { staffKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { useQuery } from "@tanstack/react-query";
import { productionColumns } from "./components/ProductionColumn";
import StaffPageTop from "./components/ProductionPageTop";
import type { ProductionOrder } from "@/schema/(branchSchema)/operations/production";

const deleteDialogText={
          title: "Permanently Delete Staff",
          description:
            "This will remove the staff and all related sessions, appointments, payments, memberships, and packages. This action cannot be undone.",
          btnName: "Confirm Delete",
        }

function ProductionPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<ProductionOrder & {id: number}>>({
    queryKey: [staffKeys.ALL_STAFF, params],
    queryFn: async () => {
      return await authInstance.get(branchEndpoints.STAFF, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const staffs = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <StaffPageTop />
      </Page.Header>
      
      <Page.Content>
        <DataTable
          columns={productionColumns}
          data={staffs}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<ProductionOrder & {id: number}>
        deleteCallBack={(data) => {
          return authInstance.post(`${branchEndpoints.BULKDELETE}`, {
            object_ids: data.map((item) => item.id),
            model: "branch.Staff",
          });
        }}
        dialogText={deleteDialogText}
        confirmText="Delete all"
        allRows={staffs}
        invalidateKeys={[staffKeys.ALL_STAFF]}
        deleteName="Staff"
      />
    </Page>
  );
}

export default ProductionPage;
