import { createBrowserRouter } from "react-router";
import AuthRedirectGuard from "@/components/guards/AuthRedirectGuard";
import AuthRequiredGuard from "@/components/guards/AuthRequiredGuard";
import LoginGuard from "@/components/guards/LoginGuard";
import Sidebar from "@/components/layout/sidebar/SideBar";

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
import ExpensePage from "./pages/(branch)/operations/expenses/ExpensePage";
import ExpenseAddEditPage from "./pages/(branch)/operations/expenses/type/AddEditPage";
import FinishedGoodPage from "./pages/(branch)/warehouse/finishedGoods/FinishedGoodPage";
import TransferPage from "./pages/(branch)/warehouse/transfers/TransferPage";
import SellerPage from "./pages/(branch)/distribution/sellers/SellerPage";
import SellerAddEditPage from "./pages/(branch)/distribution/sellers/type/AddEditPage";
import SalesDispatchPage from "./pages/(branch)/distribution/salesDispatch/SalesDispatchPage";
import SalesDispatchAddEditPage from "./pages/(branch)/distribution/salesDispatch/type/AddEditPage";
import InvoicePage from "./pages/(branch)/billing/invoices/InvoicePage";

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
        element: <DashBoardPage />,
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
        path: "expenses",
        element: <ExpensePage />,
      },
      {
        path: "expenses/:type",
        element: <ExpenseAddEditPage />,
      },
      {
        path: "store",
        element: <FinishedGoodPage />,
      },
      {
        path: "store/transfers",
        element: <TransferPage />,
      },
      {
        path: "sellers",
        element: <SellerPage />,
      },
      {
        path: "sellers/:type",
        element: <SellerAddEditPage />,
      },
      {
        path: "sales-dispatch",
        element: <SalesDispatchPage />,
      },
      {
        path: "sales-dispatch/:type",
        element: <SalesDispatchAddEditPage />,
      },
      {
        path: "billing/invoices",
        element: <InvoicePage />,
      },
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
