import { Page } from "@/components/layout/page/PageLayout";
import CategoryTop from "./components/ServiceCategoryTop";
import { branchEndpoints } from "@/config/endpoints";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import type { ServiceCategory } from "@/types/(branch)/catalog/services";
import { serviceKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import { authInstance } from "@/config/axios-interceptor";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/table/data-table";
import { serviceCategoryColumns } from "./components/ServiceCategoryColumn";
import { SelectionActionBar } from "@/components/SelectionActionBar";

function ServiceCategoryPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<ServiceCategory>>({
    queryKey: [serviceKeys.SERVICE_CATEGORY_LIST, params],
    queryFn: async () => {
      return await authInstance.get(branchEndpoints.SERVICE_CATEGORIES, {
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
          columns={serviceCategoryColumns}
          data={categories}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>
      <SelectionActionBar<ServiceCategory>
        deleteCallBack={(data) => {
          return authInstance.post(`${branchEndpoints.BULKDELETE}`, {
            object_ids: data.map((item) => item.id),
            model: "branch.ServiceCategory",
          });
        }}
        dialogText={{
          title: "Permanently Delete Categories",
          description:
            "This will remove the service category and all related services. This action cannot be undone.",
          btnName: "Confirm Delete",
        }}
        allRows={categories}
        invalidateKeys={[serviceKeys.SERVICE_CATEGORY_LIST]}
        deleteName="Categories"
      />
    </Page>
  );
}

export default ServiceCategoryPage;
