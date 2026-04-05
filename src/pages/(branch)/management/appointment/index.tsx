import { Page } from "@/components/layout/page/PageLayout";
import { DataTable } from "@/components/table/data-table";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import type { Appointment } from "@/types/(branch)/management/appointment";
import { useQuery } from "@tanstack/react-query";
import { appointmentColumns } from "./components/AppointmentColumn";
import AppointmentPageTop from "./components/AppointmentPageTop";

function AppointmentPage() {
  const { data, isLoading } = useQuery<PaginatedResponse<Appointment>>({
    queryKey: ["appointments"],
    queryFn: async () => {
      return await authInstance.get(branchEndpoints.APPOINTMENT);
    },
  });

  console.log("this is the aappoint ment fetch data", data);
  
  return (
    <Page>
      <Page.Header>
        <AppointmentPageTop />
      </Page.Header>
      <Page.Content>
        <DataTable
          columns={appointmentColumns}
          data={data?.results || []}
          isLoading={isLoading}
          totalCount={data?.count || 0}
        />
      </Page.Content>
    </Page>
  );
}

export default AppointmentPage;
