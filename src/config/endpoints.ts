const branchEndpoints = {
  CUSTOMER: "/branch/customers/",
  APPOINTMENT: "/branch_management/appointments/",
  STAFF: "/branch_management/staff/",
  BULKDELETE: "/mainapp/bulk-delete/branch/",
  SERVICES: "/branch_catalog/services/",
  SERVICE_CATEGORIES: "/branch_catalog/categories/",
  PRODUCTS: "/branch_catalog/products/",
  PRODUCT_CATEGORIES: "/branch_catalog/product-categories/",
  PRODUCT_BATCHES: "/branch_catalog/product-batches/",
};

const operationsEndpoints = {
  RAW_MATERIALS: "/raw-materials/",
  EXPENSES: "/expenses/",
  PRODUCTION_ORDERS: "/production-orders/",
  TRANSFERS: "/transfers/",
  FINISHED_GOODS: "/finished-goods/",
};

const salesEndpoints = {
  SELLERS: "/sellers/",
  SALES_DISPATCHES: "/sales-dispatches/",
  INVOICES: "/invoices/",
};

const dashboardEndpoints = {
  DASHBOARD: "/dashboard/",
};

export { branchEndpoints, operationsEndpoints, salesEndpoints, dashboardEndpoints };
