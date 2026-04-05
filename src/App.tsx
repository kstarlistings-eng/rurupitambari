import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import {routerBranch} from "./Route";

import FullScreenLoader from "./components/loader/FullScreenLoader";
import SuspenseErrorWrapper from "./components/error/suspenseErrorWrapper";
import DomainNotFound from "./components/error/domain/DomainNotFound";
export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <SuspenseErrorWrapper
          fallback={
            <FullScreenLoader text="Checking Domain..." type="loader3" />
          }
          errorLayout={<DomainNotFound />}
        >
          {/* <SubDomainGuard> */}
            {/* <OrgBranchGuard> */}
              
                <RouterProvider router={routerBranch} />
              
            {/* </OrgBranchGuard> */}
          {/* </SubDomainGuard> */}
        </SuspenseErrorWrapper>
        <ReactQueryDevtools initialIsOpen={false} />
        <ToastContainer />
      </NuqsAdapter>
    </QueryClientProvider>
  );
}

export default App;
