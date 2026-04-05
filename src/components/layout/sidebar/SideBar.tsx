import { useState } from "react";
import { Outlet } from "react-router";
import { SidebarNav } from "./SidebarNav";
import SidebarMobile from "./SidebarMobile";
import BrandLogoImg from "@/assets/pitambariLogo.jpg"
// import { BrandLogo } from "@/icons copy/BrandLogo";
import { useAuthStore } from "@/store/auth-store";

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const date = new Date();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  const result = formattedDate.replace(",", " •");

  const { user } = useAuthStore();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:block h-screen">
        <SidebarNav
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-neutral-200 px-6 h-[70px] hidden items-center justify-between shrink-0 md:flex">
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium text-neutral-700">
              Good Afternoon, {user?.first_name} {user?.last_name}
            </span>
          </div>
          <div className="text-sm font-normal text-neutral-500">{result}</div>
        </header>

        <header className="bg-white border-b border-neutral-200 px-6 h-[70px] flex items-center justify-between shrink-0 md:hidden">
          <SidebarMobile />
          {/* <BrandLogo /> */}
          <img src={BrandLogoImg} alt="Pitambari Logo" className="w-28" />
          <div className="relative shrink-0">
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center overflow-hidden">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <span className="absolute bottom-0 right-0 w-[9px] h-[9px] bg-green-500 border-2 border-white rounded-full" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto  sm:py-8 sm:px-9 px-4 py-4 bg-neutral-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
