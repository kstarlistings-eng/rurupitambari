import CustomFilter from "@/components/custom-ui/CustomFilter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchParamsManager } from "@/hooks/useSearchParamsManager";
import { cn } from "@/lib/utils";
import { ChevronDown, SearchIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

export function PageAction({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>{children}</div>
  );
}

PageAction.Search = function PageActionSearch({
  className,
}: {
  className?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [name, setName] = useQueryState("search", parseAsString);
  const [inputValue, setInputValue] = useState(name ?? "");
  const debouncedValue = useDebouncedValue(inputValue);

  const { clearPagination } = useSearchParamsManager();

  useEffect(() => {
    clearPagination();
    setName(encodeURIComponent(debouncedValue) || null);
  }, [debouncedValue, setName, clearPagination]);

  return (
    <div className={cn("relative h-[42px] w-full bg-white", className)}>
      <Input
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="ps-8.5 py-2 pe-2 focus-visible:ring-1 !h-[42px] min-w-[240px] w-full "
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <SearchIcon
        size={18}
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none transition-colors",
          isFocused && "text-primary-500",
        )}
      />
    </div>
  );
};

type FilterOptions = {
  label: string;
  value: string;
};

PageAction.Filter = function PageActionFilter({
  className,
  filterKey,
  defaultFilterValue,
  options,
  labelValue,
  placeHolder,
  disabled = false,
}: {
  filterKey: string;
  defaultFilterValue?: FilterOptions["value"];
  options: FilterOptions[];
  labelValue?: string;
  className?: string;
  placeHolder?: string;
  disabled?: boolean;
}) {
  const [itemFilterValue, setItemFilterValue] = useQueryState(filterKey, {
    throttleMs: 500,
    shallow: true,
    defaultValue: defaultFilterValue || "",
  });
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          className={cn("w-48 !justify-start text-neutral-700", className)}
          variant="outline"
        >
          <span className="truncate">
            {options.find((o) => o.value === itemFilterValue)?.label ||
              placeHolder}
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "ms-auto transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[var(--radix-dropdown-menu-trigger-width)] p-0 w-fit">
        <DropdownMenuGroup className="py-2">
          {labelValue && <DropdownMenuLabel>{labelValue}</DropdownMenuLabel>}
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => setItemFilterValue(option.value)}
              className={cn("cursor-pointer rounded-none px-5 py-2")}
            >
              {option.label}
              {option.value === itemFilterValue && (
                <span className="ms-auto text-success-500">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

PageAction.FilterSheet = function PageActionFilterSheet() {
  return <CustomFilter title="sfd" caption="sdfjk" filter={[]} />;
};
