import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { customerKeys } from "@/config/querykeys/(branchKeys)/customerKey";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import type { Customer } from "@/types/(branch)/management/customer";
import { useQuery } from "@tanstack/react-query";
import { customerColumns } from "./components/CustomerColumn";
import CustomerPageTop from "./components/CustomerPageTop";

function CustomerPage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<Customer>>({
    queryKey: [customerKeys.ALL_CUSTOMERS, params],
    queryFn: async () => {
      return await authInstance.get(branchEndpoints.CUSTOMER, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const customers = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <CustomerPageTop />
      </Page.Header>
      <Page.Content>
        <DataTable
          columns={customerColumns}
          data={customers}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>
      <SelectionActionBar<Customer>
        deleteCallBack={(data) => {
          return authInstance.post(`${branchEndpoints.BULKDELETE}`, {
            object_ids: data.map((item) => item.id),
            model: "branch.Customer",
          });
        }}
        dialogText={{
          title: "Permanently Delete Customers",
          description:
            "This will remove the customer and all related sessions, appointments, payments, memberships, and packages. This action cannot be undone.",
          btnName: "Confirm Delete",
        }}
        confirmText="Delete all"
        allRows={customers}
        invalidateKeys={[customerKeys.ALL_CUSTOMERS]}
        deleteName="Customers"
      />
    </Page>
  );
}

export default CustomerPage;
