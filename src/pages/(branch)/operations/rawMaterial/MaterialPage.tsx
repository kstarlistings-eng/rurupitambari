import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { rawMaterialKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { useQuery } from "@tanstack/react-query";
import { materialColumns } from "./components/MaterialColumn";
import MaterialPageTop from "./components/MaterialPageTop";
import type { Material } from "@/schema/(branchSchema)/operations/material";

const deleteDialogText = {
  title: "Permanently Delete Material",
  description:
    "This will remove the material from inventory. This action cannot be undone.",
  btnName: "Confirm Delete",
};

function RawMaterialPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<Material & { id: string; current_quantity: number }>>({
    queryKey: [rawMaterialKeys.ALL_RAW_MATERIALS, params],
    queryFn: async () => {
      return await authInstance.get(operationsEndpoints.RAW_MATERIALS, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const materials = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <MaterialPageTop />
      </Page.Header>

      <Page.Content>
        <DataTable
          columns={materialColumns}
          data={materials}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<Material & { id: string }>
        deleteCallBack={(data) => {
          return authInstance.post(`${operationsEndpoints.RAW_MATERIALS}bulk-delete/`, {
            object_ids: data.map((item) => item.id),
          });
        }}
        dialogText={deleteDialogText}
        confirmText="Delete all"
        allRows={materials}
        invalidateKeys={[rawMaterialKeys.ALL_RAW_MATERIALS]}
        deleteName="Material"
      />
    </Page>
  );
}

export default RawMaterialPage;
