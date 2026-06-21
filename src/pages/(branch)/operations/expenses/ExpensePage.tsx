import { Page } from "@/components/layout/page/PageLayout";
import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { operationsEndpoints } from "@/config/endpoints";
import { expenseKeys } from "@/config/querykeys/(branchKeys)/operationsKeys";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { useQuery } from "@tanstack/react-query";
import { expenseColumns, type ExpenseRow } from "./components/ExpenseColumn";
import ExpensePageTop from "./components/ExpensePageTop";

const deleteDialogText = {
  title: "Permanently Delete Expenses",
  description:
    "This will remove the selected expense records. This action cannot be undone.",
  btnName: "Confirm Delete",
};

function ExpensePage() {
  const { params } = useSearchParamsManager();
  const { data, isLoading } = useQuery<PaginatedResponse<ExpenseRow>>({
    queryKey: [expenseKeys.ALL_EXPENSES, params],
    queryFn: async () => {
      return await authInstance.get(operationsEndpoints.EXPENSES, {
        params: {
          ...params,
          limit: 8,
        },
      });
    },
  });

  const expenses = data?.results || [];
  return (
    <Page>
      <Page.Header>
        <ExpensePageTop />
      </Page.Header>

      <Page.Content>
        <DataTable
          columns={expenseColumns}
          data={expenses}
          isLoading={isLoading}
          totalCount={data?.count || 0}
          limit={8}
        />
      </Page.Content>

      <SelectionActionBar<ExpenseRow>
        deleteCallBack={(data) => {
          return Promise.all(
            data.map((item) =>
              authInstance.delete(`${operationsEndpoints.EXPENSES}${item.id}/`)
            )
          );
        }}
        dialogText={deleteDialogText}
        confirmText="Delete all"
        allRows={expenses}
        invalidateKeys={[expenseKeys.ALL_EXPENSES]}
        deleteName="Expense"
      />
    </Page>
  );
}

export default ExpensePage;
