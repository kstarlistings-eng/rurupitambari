import {
  BuildingIcon,
  HomeIcon,
  SettingsIcon,
  ChartLine,
  Banknote,
  UsersIcon,
  ScissorsIcon,
  MonitorIcon,
  CreditCardIcon,
  GlobeIcon,
  BarChart3Icon,
  GridIcon,
  HardHat,
  CirclePile,
  ShoppingBasket,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  link: string;
  children?: NavChild[];
};

export type NavChild = {
  id: string;
  label: string;
  link: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const iconBtnClass =
  "flex items-center justify-center w-[34px] h-[34px] rounded-[9px] border-none bg-transparent cursor-pointer text-neutral-700 transition-[background,color] duration-150 hover:bg-primary-50 hover:text-primary-700";

export const navSuperAdmin: NavGroup[] = [
  {
    label: "Super Admin",
    items: [
      { id: "dashboard", label: "Dashboard", icon: HomeIcon, link: "" },
      {
        id: "organizations",
        label: "Organizations",
        icon: BuildingIcon,
        link: "/organizations",
      },
      {
        id: "platform-settings",
        label: "Platform Settings",
        icon: SettingsIcon,
        link: "/platform-settings",
      },
    ],
  },
];

export const navOrganization: NavGroup[] = [
  {
    label: "Organization",
    items: [
      { id: "branches", label: "Branches", icon: BuildingIcon, link: "/" },
      { id: "reports", label: "Reports", icon: ChartLine, link: "/reports" },
      {
        id: "payment_reports",
        label: "Payment Reports",
        icon: Banknote,
        link: "/payment-reports",
      },
    ],
  },
];

export const navBranch: NavGroup[] = [
  {
    label: "Main",
    items: [{ id: "dashboard", label: "Dashboard", icon: HomeIcon, link: "/" }],
  },
  {
    label: "Operations",
    items: [
      { id: "raw_material", label: "Raw Material", icon: CirclePile, link: "/raw-material" },
      {
        id: "production",
        label: "Production",
        icon: HardHat,
        link: "/production",
      },
      {
        id: "billing",
        label: "Billing",
        icon: CreditCardIcon,
        link: "/billing",
        children: [
          { id: "invoices", label: "Invoices", link: "/billing/invoices" },
          { id: "payments", label: "Payments", link: "/billing/payments" },
        ],
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        id: "management",
        label: "Management",
        icon: UsersIcon,
        link: "/customer",
        children: [
          { id: "store", label: "Store", link: "/store" },
          // { id: "appointments", label: "Appointments", link: "/appointments" },
          { id: "staff", label: "Staff", link: "/staff" },
        ],
      },
      {
        id: "catalog",
        label: "Catalog",
        icon: ShoppingBasket,
        link: "/catalog",
        children: [
          // { id: "services", label: "Services", link: "/catalog/services" },
          { id: "products", label: "Products", link: "/catalog/products" },
        ],
      },
    ],
  },
  {
    label: "Benefits",
    items: [
      {
        id: "benefits",
        label: "Benefits",
        icon: GridIcon,
        link: "/benefits",
        children: [
          {
            id: "memberships",
            label: "Memberships",
            link: "/benefits/memberships",
          },
          { id: "loyalty", label: "Loyalty", link: "/benefits/loyalty" },
        ],
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3Icon,
        link: "/analytics",
        children: [
          { id: "overview", label: "Overview", link: "/analytics/overview" },
          { id: "reports", label: "Reports", link: "/analytics/reports" },
        ],
      },
    ],
  },
];
