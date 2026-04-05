import { PageAction } from "@/components/layout/page/PageAction";
import { Page } from "@/components/layout/page/PageLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

function AppointmentPageTop() {
  const navigate = useNavigate();
  return (
    <>
      <Page.HeaderLeftContainer className="min-[1120px]:w-auto w-full flex-wrap gap-y-2">
        <Page.HeaderContent>
          <Page.HeaderTitle>Appointments</Page.HeaderTitle>
          <Page.HeaderDescription className="sm:block hidden">
            Manage customer appointments and bookings
          </Page.HeaderDescription>
        </Page.HeaderContent>
        <div className="block min-[1120px]:hidden max-[360px]:ms-0 ms-auto">
          {/* Add button */}
          <Button variant={"default"} onClick={() => navigate("add")}>
           
            Add Appointment
          </Button>
        </div>
        <Page.HeaderDescription className="sm:hidden block w-full">
          Manage customer appointments and bookings
        </Page.HeaderDescription>
      </Page.HeaderLeftContainer>
      <Page.PageHeaderRightContainer className="w-full min-[1120px]:w-auto">
        <PageAction className="w-full min-[1120px]:w-auto h-[42px] sm:flex-nowrap flex-wrap">
          <PageAction.Search />
          <div className="flex gap-2 items-center w-full">
            <PageAction.FilterSheet />
            <div id="portalFilterColumns" className="h-full" />
          </div>
        </PageAction>
        <div className="hidden min-[1120px]:flex gap-2">
          {/* Add button */}
          <Button variant={"default"} onClick={() => navigate("add")}>  
            Add Appointment
          </Button>
        </div>
      </Page.PageHeaderRightContainer>
    </>
  );
}

export default AppointmentPageTop;
