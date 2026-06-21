import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { salesEndpoints } from "@/config/endpoints";
import { invoiceKeys } from "@/config/querykeys/(branchKeys)/salesKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { useQuery } from "@tanstack/react-query";
import { invoiceColumns, type Invoice } from "./components/InvoiceColumn";
import InvoicePageTop from "./components/InvoicePageTop";

const deleteDialogText = {
  title: "Permanently Delete Invoices",
  description:
    "This will remove the selected invoice records. This action cannot be undone.",
  btnName: "Confirm Delete",
};

function InvoicePage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<Invoice>>({
    queryKey: [invoiceKeys.ALL_INVOICES, params],
    queryFn: async () => {
      return await authInstance.get(salesEndpoints.INVOICES, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const invoices = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <InvoicePageTop />
      </Page.Header>

      <Page.Content>
        <DataTable
          columns={invoiceColumns}
          data={invoices}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<Invoice>
        deleteCallBack={(data) => {
          return Promise.all(
            data.map((item) =>
              authInstance.delete(`${salesEndpoints.INVOICES}${item.id}/`)
            )
          );
        }}
        dialogText={deleteDialogText}
        confirmText="Delete all"
        allRows={invoices}
        invalidateKeys={[invoiceKeys.ALL_INVOICES]}
        deleteName="Invoice"
      />
    </Page>
  );
}

export default InvoicePage;
