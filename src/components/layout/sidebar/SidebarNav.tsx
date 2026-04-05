import { BellIcon, LogOutIcon, MenuIcon } from "lucide-react";
import BrandLogoImg from "@/assets/pitambariLogo.jpg"
import { BrandLogo } from "@/icons copy/BrandLogo";
import {
  iconBtnClass,
  navBranch,
  navOrganization,
  navSuperAdmin,
} from "./navConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/auth-store";
import { domainConfig } from "@/config/domain";
import { DeleteOrganizationModal } from "@/components/globalModels/deleteModel";
import { CollapsibleNavItem } from "./CollapsibleNavItem";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  onNavClick?: (id: string) => void;
};

export function SidebarNav({ collapsed, onToggle, onNavClick }: Props) {
  const { logout, user } = useAuthStore();
  const nav = navBranch

  return (
    <TooltipProvider delayDuration={1000}>
      <aside
        className={`${
          collapsed
            ? "w-[68px] min-w-[68px] p-3"
            : "w-[248px] min-w-[248px] p-5"
        } h-screen bg-white border-r border-[#f0edf8] flex flex-col overflow-hidden relative z-10 shadow-[2px_0_16px_0_rgba(124,58,237,0.04)] transition-[width,min-width] duration-[280ms] ease-[cubic-bezier(.4,0,.2,1)] gap-6 `}
      >
        {/* Top bar */}
        <div
          className={`flex items-center py-1 gap-2 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src={BrandLogoImg} alt="Pitambari Logo" className="w-18" />
              {/* <BrandLogo /> */}
            </div>
          )}
          <div className="flex items-center gap-1 shrink-0">
            {!collapsed && (
              <button className={iconBtnClass} title="Notifications">
                <BellIcon />
              </button>
            )}
            <button
              onClick={onToggle}
              className={iconBtnClass}
              title={collapsed ? "Expand" : "Collapse"}
            >
              <span
                className={`inline-flex transition-transform duration-[280ms] ${
                  collapsed ? "rotate-180" : "rotate-0"
                }`}
              >
                <MenuIcon />
              </span>
            </button>
          </div>
        </div>

        {/* Nav groups */}
        <div className="grow overflow-y-auto overflow-x-hidden hide-scrollbar">
          {nav.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="px-[4px] py-[8px] transition-opacity duration-200">
                  <span className="text-sm font-medium text-neutral-500">
                    {group.label}
                  </span>
                </div>
              )}
              <nav className={`flex-1 py-2 flex flex-col gap-0.5`}>
                {group.items.map((item) => (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <div>
                        <CollapsibleNavItem
                          item={item}
                          collapsed={collapsed}
                          onNavClick={onNavClick}
                        />
                      </div>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </nav>
            </div>
          ))}
        </div>
        {/* User footer */}
        <DeleteOrganizationModal
          dialogText={{
            title: "Are you sure?",
            btnName: "Logout",
          }}
          onConfirm={() => logout()}
          showDefaultNotification={false}
        >
          <div
            className={`py-1 border rounded-xl border-neutral-200 overflow-hidden hover:bg-primary-50 cursor-pointer transition-[background] `}
          >
            <div
              className={`flex items-center rounded-xl cursor-pointer transition-[background] ${
                collapsed
                  ? "justify-center gap-0 px-0 py-2"
                  : "justify-start gap-[10px] px-[10px] py-2"
              }`}
            >
              {!collapsed && (
                <>
                  <div className="relative shrink-0">
                    <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center overflow-hidden">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    </div>
                    <span className="absolute bottom-0 right-0 w-[9px] h-[9px] bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  {/* <div className="flex-1 w-[60%] max-w-[60%] min-w-0">
                    <div className="text-sm font-medium text-neutral-700  truncate ">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-[12px] text-neutral-500  truncate ">
                      {user?.email}
                    </div>
                  </div> */}

                  <div className="w-full text-red-500 font-medium">
                  <p>Logout</p>
                </div>
                </>
              )}
              <span className="text-neutral-700 flex shrink-0">
                <LogOutIcon />
              </span>
            </div>
          </div>
        </DeleteOrganizationModal>
      </aside>
    </TooltipProvider>
  );
}
