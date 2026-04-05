import { SelectionActionBar } from "@/components/SelectionActionBar";
import { DataTable } from "@/components/table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { orgKeys } from "@/config/querykeys/organization";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { productionColumns } from "@/pages/(branch)/operations/productions/components/ProductionColumn";
// import {
//   BulkDeleteOrganization,
//   FetchOrganization,
// } from "@/services/organization";
import { useQuery } from "@tanstack/react-query";

function DashboardTable() {
  const { params } = useSearchParamsManager();

  const { data, isLoading } = useQuery({
    queryKey: [orgKeys.getAllOrganization, params],
    queryFn: async () => {
      // return await FetchOrganization({ ...params, limit: 6 });
      return  {
        count: 0,
        results: [],
      };
    },
  });
  return (
    <div>
      <div className=" bg-white rounded-lg p-6  border rounded-br-none rounded-bl-none border-neutral-200 border-b-0">
        <div className="flex gap-2 items-center justify-between">
          <h2 className="text-[16px] font-medium text-neutral-500">
            Recent Orders
          </h2>
          {isLoading ? (
            <Skeleton className="h-[48px] w-42 rounded-full" />
          ) : (
            <div className="px-4 py-3 bg-primary-50 text-primary shadow-none rounded-full font-medium">
              {data?.count || 0} Orders
            </div>
          )}
        </div>
      </div>
      <DataTable
        columns={productionColumns}
        data={data?.results || []}
        totalCount={data?.count || 0}
        isLoading={isLoading}
        showPagination={false}
        className="rounded-tr-none rounded-tl-none border-t-none"
      />
      <SelectionActionBar
        allRows={data?.results || []}
        deleteName="Organization?"
        invalidateKeys={[[orgKeys.getAllOrganization, params]]}
        deleteCallBack={(data) => {
          console.log("This is data", data);
          // await BulkDeleteOrganization(data.map((e: any) => e?.id));
        }}
      />
    </div>
  );
}

export default DashboardTable;
