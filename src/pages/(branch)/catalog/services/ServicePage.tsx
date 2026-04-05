import { Page } from "@/components/layout/page/PageLayout";
import ServicePageTop from "./components/ServicePageTop";
import { DataTable } from "@/components/table/data-table";
import { useQuery } from "@tanstack/react-query";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import type { Service } from "@/types/(branch)/catalog/services";
import { serviceColumns } from "./components/ServiceColumn";
import { serviceKeys } from "@/config/querykeys/(branchKeys)/managementKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { SelectionActionBar } from "@/components/SelectionActionBar";

function ServicePage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<Service>>({
    queryKey: [serviceKeys.ALL_SERVICES, params],
    queryFn: async () => {
      return await authInstance.get(branchEndpoints.SERVICES, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const services = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <ServicePageTop />
      </Page.Header>
      <Page.Content>
        <DataTable
          columns={serviceColumns}
          data={services}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<Service>
        deleteCallBack={(data) => {
          return authInstance.post(`${branchEndpoints.BULKDELETE}`, {
            object_ids: data.map((item) => item.id),
            model: "branch.Service",
          });
        }}
        dialogText={{
          title: "Permanently Delete Services",
          description:
            "This will remove the service and all related sessions, appointments, payments, memberships, and packages. This action cannot be undone.",
          btnName: "Confirm Delete",
        }}
        allRows={services}
        invalidateKeys={[serviceKeys.ALL_SERVICES]}
        deleteName="Services"
      />
    </Page>
  );
}

export default ServicePage;
