import { NavLink, useLocation } from "react-router";
import { ChevronDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import type { NavItem } from "./navConfig";

interface CollapsibleNavItemProps {
  item: NavItem;
  collapsed?: boolean; // sidebar collapsed state
  onNavClick?: (id: string) => void;
}

export function CollapsibleNavItem({
  item,
  collapsed = false,
  onNavClick,
}: CollapsibleNavItemProps) {
  const location = useLocation();
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  // Auto-expand if any child is active
  const isChildActive = hasChildren
    ? item.children!.some((child) => location.pathname === child.link)
    : false;

  const [expanded, setExpanded] = useState(isChildActive);

  // Keep in sync when route changes
  useEffect(() => {
    if (isChildActive) setExpanded(true);
  }, [isChildActive]);

  // No children — simple NavLink
  if (!hasChildren) {
    return (
      <NavLink
        to={item.link}
        end
        onClick={() => onNavClick?.(item.id)}
        className={({ isActive }) =>
          `flex items-center relative whitespace-nowrap overflow-hidden w-full rounded-xl border-none cursor-pointer transition-[background,color] duration-150 font-medium text-sm hover:bg-primary-50 hover:text-primary-700 px-3 ${
            collapsed
              ? "justify-center gap-0 py-3"
              : "justify-start gap-[10px] py-[10px]"
          } ${
            isActive
              ? "bg-primary-50 text-primary-700"
              : "bg-transparent text-neutral-700"
          }`
        }
      >
        <span className="shrink-0 flex">
          <Icon />
        </span>
        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
      </NavLink>
    );
  }

  // With children — collapsible
  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`flex items-center relative whitespace-nowrap overflow-hidden w-full rounded-xl border-none cursor-pointer transition-[background,color] duration-150 font-medium text-sm hover:bg-primary-50 hover:text-primary-700 px-3 bg-transparent ${
          collapsed
            ? "justify-center gap-0 py-3"
            : "justify-start gap-[10px] py-[10px]"
        } ${isChildActive ? "text-primary-700" : "text-neutral-700"}`}
      >
        <span className="shrink-0 flex">
          <Icon />
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronDownIcon
              className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                expanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </>
        )}
      </button>

      {/* Children */}
      {!collapsed && (
        <div
          className={`overflow-hidden transition-all duration-200 ${
            expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-1 flex flex-col gap-0.5">
            {item.children!.map((child) => (
              <NavLink
                key={child.id}
                to={child.link}
                onClick={() => onNavClick?.(child.id)}
                className={({ isActive }) =>
                  `block rounded-lg ps-11 pe-3 py-[8px] text-sm font-medium transition-[background,color] duration-150 ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:bg-primary-50 hover:text-primary-700"
                  }`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
