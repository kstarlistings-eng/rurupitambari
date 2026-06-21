import {
  HomeIcon,
  Banknote,
  CreditCardIcon,
  HardHat,
  CirclePile,
  StoreIcon,
  TruckIcon,
  PackageIcon,
  UsersIcon,
} from "lucide-react";

export type UserRole =
  | "admin_finance"
  | "production_operator"
  | "store_operator";

export type NavItem = {
  id: string;
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  link: string;
  children?: NavChild[];
  roles?: UserRole[];
};

export type NavChild = {
  id: string;
  label: string;
  link: string;
  roles?: UserRole[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const iconBtnClass =
  "flex items-center justify-center w-[34px] h-[34px] rounded-[9px] border-none bg-transparent cursor-pointer text-neutral-700 transition-[background,color] duration-150 hover:bg-primary-50 hover:text-primary-700";

export const navBranch: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: HomeIcon,
        link: "/",
        roles: ["admin_finance"],
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        id: "raw_material",
        label: "Raw Material",
        icon: CirclePile,
        link: "/raw-material",
        roles: ["admin_finance", "production_operator"],
      },
      {
        id: "production",
        label: "Production",
        icon: HardHat,
        link: "/production",
        roles: ["admin_finance", "production_operator"],
      },
      {
        id: "expenses",
        label: "Expenses",
        icon: Banknote,
        link: "/expenses",
        roles: ["admin_finance"],
      },
      {
        id: "billing",
        label: "Billing",
        icon: CreditCardIcon,
        link: "/billing/invoices",
        roles: ["admin_finance"],
        children: [
          { id: "invoices", label: "Invoices", link: "/billing/invoices", roles: ["admin_finance"] },
        ],
      },
    ],
  },
  {
    label: "Warehouse",
    items: [
      {
        id: "store",
        label: "Store / Finished Goods",
        icon: StoreIcon,
        link: "/store",
        roles: ["admin_finance", "store_operator"],
      },
      {
        id: "transfers",
        label: "Receive Transfers",
        icon: TruckIcon,
        link: "/store/transfers",
        roles: ["admin_finance", "store_operator"],
      },
    ],
  },
  {
    label: "Distribution",
    items: [
      {
        id: "sellers",
        label: "Sellers / Dealers",
        icon: UsersIcon,
        link: "/sellers",
        roles: ["admin_finance", "store_operator"],
      },
      {
        id: "sales_dispatch",
        label: "Sales Dispatch",
        icon: PackageIcon,
        link: "/sales-dispatch",
        roles: ["admin_finance", "store_operator"],
      },
    ],
  },
];

export function filterNavByRole(
  nav: NavGroup[],
  role: UserRole | undefined
): NavGroup[] {
  if (!role) return [];

  return nav
    .map((group) => {
      const items = group.items
        .map((item) => {
          if (item.roles && !item.roles.includes(role)) return null;

          const children = item.children
            ? item.children.filter(
                (child) => !child.roles || child.roles.includes(role)
              )
            : undefined;

          return { ...item, children };
        })
        .filter(Boolean) as NavItem[];

      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);
}
