import { createBrowserRouter } from "react-router";
import AuthRedirectGuard from "@/components/guards/AuthRedirectGuard";
import AuthRequiredGuard from "@/components/guards/AuthRequiredGuard";
import LoginGuard from "@/components/guards/LoginGuard";
import Sidebar from "@/components/layout/sidebar/SideBar";
import CustomerPage from "@/pages/(branch)/management/customer/CustomerPage";
import CustomerAddEditPage from "@/pages/(branch)/management/customer/type/AddEditPage";
import StaffPage from "@/pages/(branch)/management/staff/StaffPage";
import StaffAddEditPage from "@/pages/(branch)/management/staff/type/AddEditPage";
import MaterialAddEditPage from "@/pages/(branch)/operations/rawMaterial/type/AddEditPage";
import ProductionAddEditPage from "@/pages/(branch)/operations/productions/type/AddEditPage";
import ChairlyoLogin from "@/pages/login";
import ServicePage from "@/pages/(branch)/catalog/services/ServicePage";
import ServiceForm from "@/pages/(branch)/catalog/services/type/AddEditPage";
import ServiceCategoryPage from "@/pages/(branch)/catalog/services/category/CategoryPage";
import ProductPage from "@/pages/(branch)/catalog/products/ProductPage";
import ProductCategoryPage from "@/pages/(branch)/catalog/products/category/CategoryPage";
import ProductBatchPage from "@/pages/(branch)/catalog/products/batch/ProductBatchPage";
import ProductAddEditPage from "@/pages/(branch)/catalog/products/type/ProductAddEditPage";
import RawMaterialPage from "./pages/(branch)/operations/rawMaterial/MaterialPage";
import ProductionPage from "./pages/(branch)/operations/productions/ProductionPage";
import DashBoardPage from "./pages/(branch)/dashboard";

const routerBranch = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthRequiredGuard>
        <AuthRedirectGuard>
          <Sidebar />
        </AuthRedirectGuard>
      </AuthRequiredGuard>
    ),
    children: [
      {
        index: true,
        element: <DashBoardPage/>,
      },
      {
        path: "raw-material",
        element: <RawMaterialPage />,
      },
      {
        path: "raw-material/:type",
        element: <MaterialAddEditPage />,
      },
      {
        path: "production",
        element: <ProductionPage />,
      },
      {
        path: "production/:type",
        element: <ProductionAddEditPage />,
      },
      {
        path: "store",
        element: <CustomerPage />,
      },
      {
        path: "store/:type",
        element: <CustomerAddEditPage />,
      },
      // {
      //   path: "appointments",
      //   element: <AppointmentPage />,
      // },
      // {
      //   path: "appointments/:type",
      //   element: <AppointmentAddEditPage />,
      // },
      {
        path: "staff",
        element: <StaffPage />,
      },
      {
        path: "staff/:type",
        element: <StaffAddEditPage />,
      },
      {
        path: "/catalog/services",
        element: <ServicePage />,
      },
      {
        path: "/catalog/services/:type",
        element: <ServiceForm />,
      },
      {
        path: "/catalog/services/detail/manage-category",
        element: <ServiceCategoryPage />,
      },
      {
        path: "/catalog/products",
        element: <ProductPage />,
      },
      {
        path: "/catalog/products/detail/setup-category",
        element: <ProductCategoryPage />,
      },
      {
        path: "/catalog/products/detail/setup-batch",
        element: <ProductBatchPage />,
      },
      {
        path: "/catalog/products/:type",
        element: <ProductAddEditPage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <LoginGuard>
        <ChairlyoLogin />
      </LoginGuard>
    ),
  },
  {
    path: "*",
    element: (
      <AuthRedirectGuard>
        <div>Page Not Found</div>
      </AuthRedirectGuard>
    ),
  },
]);

export { routerBranch };

