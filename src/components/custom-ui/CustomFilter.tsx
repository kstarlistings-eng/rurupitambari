import SheetWrapper, {
  type SheetWrapperT,
} from "@/components/custom-ui/SheetWrapper";
import CustomDropdownFilter, {
  type CustomDropdownFilterRef,
  type FilterConfig,
} from "@/components/custom-ui/CustomDropDownFilter";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FilterModalSkeleton } from "@/components/skeleton/FIlterModalSkeletion";
import { FunnelIcon } from "lucide-react";
import { useSearchParams } from "react-router";
import { usePageNavigation } from "@/hooks/usePageNavigation";

type customFilterT = {
  filter: FilterConfig[];
  isPending?: boolean;
  filterBtnText?: string;
} & Pick<SheetWrapperT, "title" | "caption">;

export default function CustomFilter({
  filter,
  isPending = false,
  filterBtnText,
  ...sheetWrapperProps
}: customFilterT) {
  const refs = useRef<Record<string, CustomDropdownFilterRef | null>>({});

  const [hasSelection, setHasSelection] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { pageReset: resetPage } = usePageNavigation();
  const applyAllFilters = () => {
    // Apply filters first
    Object.values(refs.current).forEach((ref) => {
      ref?.applyFilter();
    });

    // Use setTimeout to ensure state updates happen after filters are applied
    setTimeout(() => {
      const hasItems = Object.values(refs.current).some(
        (ref) => ref?.selectedItems.length ?? 0 > 0,
      );
      setHasSelection(hasItems);
      setIsOpen(false);
      resetPage();
    }, 0);
  };

  const clearAllFilters = () => {
    Object.values(refs.current).forEach((ref) => {
      ref?.clearFilter();
    });
  };
  const [searchParams] = useSearchParams();
  // Check for initial query params on mount
  useEffect(() => {
    const checkInitialSelection = () => {
      // Check if any filter has values in URL params
      const hasInitialSelection = filter.some((fltr) => {
        const paramValue = searchParams.get(fltr.filterName);
        return paramValue && paramValue.length > 0;
      });

      setHasSelection(hasInitialSelection);
    };

    checkInitialSelection();
  }, [filter, searchParams]);

  if (isPending) {
    return (
      <SheetWrapper
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        variant="filter"
        title={sheetWrapperProps.title}
        caption={sheetWrapperProps.caption}
        triggerBtn={
          <Button
            variant="outline"
            className={`border-none shadow-main ${hasSelection ? "bg-neutral-100" : ""}`}
          >
            <Filter
              size={16}
              className={hasSelection ? "fill-neutral-700" : ""}
              fill="black"
            />
            {filterBtnText}
          </Button>
        }
      >
        <FilterModalSkeleton />
      </SheetWrapper>
    );
  }
  return (
    <SheetWrapper
      {...sheetWrapperProps}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      variant="filter"
      triggerBtn={
        <Button
          variant="outline"
          className={hasSelection ? "bg-neutral-100" : ""}
        >
          {hasSelection ? (
            <FunnelIcon className="w-4 h-4 text-neutral-700" />
          ) : (
            <Filter className="w-4 h-4" />
          )}
          {filterBtnText}
        </Button>
      }
      footerContent={
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={clearAllFilters}>
            Clear All
          </Button>
          <Button variant="default" type="button" onClick={applyAllFilters}>
            Apply Filters
          </Button>
        </div>
      }
    >
      {filter.map((fltr, index) => (
        <CustomDropdownFilter
          key={fltr.filterName || index} // Use filterName as key for better performance
          filter={fltr}
          ref={(el) => {
            refs.current[fltr.filterName] = el;
          }}
        />
      ))}
    </SheetWrapper>
  );
}
