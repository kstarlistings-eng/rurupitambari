import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, X, MinusIcon, Loader2 } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { motion } from "motion/react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";

export interface FilterItem {
  id: number;
  label: string;
  key: string;
}

export interface FilterConfig {
  filterName: string;
  title: string;
  filterList: FilterItem[];
  defaultFilterValue?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}
export interface CustomDropdownFilterRef {
  selectedItems: FilterItem[];
  applyFilter: () => void;
  clearFilter: () => void;
}

const CustomDropdownFilter = forwardRef<
  CustomDropdownFilterRef,
  { filter: FilterConfig; isFetchingNextPage?: boolean }
>(({ filter }, ref) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [itemFilterValue, setItemFilterValue] = useQueryState(
    filter.filterName,
    {
      throttleMs: 500,
      shallow: true,
      defaultValue: filter?.defaultFilterValue || "",
    },
  );
  const [selectedItems, setSelectedItems] = useState<FilterItem[]>(
    () =>
      itemFilterValue
        .split(",")
        .map((key) => filter.filterList.find((item) => item.key === key))
        .filter(Boolean) as FilterItem[],
  );

  const clearFilter = () => {
    setSelectedItems([]);
  };

  const handleFilterChange = (item: FilterItem) => {
    if (selectedItems.some((selected) => selected.id === item.id)) {
      setSelectedItems((prev) =>
        prev.filter((selected) => selected.id !== item.id),
      );
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  useImperativeHandle(ref, () => ({
    applyFilter() {
      setItemFilterValue(selectedItems.map((item) => item.key).join(","));
    },
    clearFilter,
    selectedItems,
  }));

  return (
    <div className="flex flex-col justify-between border-b">
      <div className="flex flex-col justify-end  gap-1 px-8 py-5">
        <div className="flex items-center justify-between min-h-8">
          <h3 className="para-16 font-medium text-neutral-700 select-none">
            {filter.title}
          </h3>
          <div className="flex items-center gap-3">
            {selectedItems.length > 0 && (
              <Badge
                variant="secondary"
                className="w-fit bg-primary-500 hover:bg-primary-600 flex items-center justify-center gap-1 px-[10px] py-[5px] rounded-full cursor-pointer"
                onClick={clearFilter}
              >
                <span className=" text-white para-14 font-medium">
                  {selectedItems.length}
                </span>

                <X className="text-white" size={16} strokeWidth={2} />
              </Badge>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`hover:bg-blue-100 rounded-sm h-6 w-6 flex justify-center items-center transition-colors cursor-pointer ${
                !isCollapsed && "bg-blue-100"
              }`}
            >
              {isCollapsed ? (
                <PlusIcon className="w-5 h-5 text-primary" />
              ) : (
                <MinusIcon className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
        {isCollapsed && selectedItems.length > 0 && (
          <div
            className={`flex items-center gap-2 flex-wrap overflow-hidden py-2`}
          >
            {selectedItems.map((item) => (
              <Badge
                key={item.id}
                className=" text-black-500 rounded-lg flex items-center gap-2 font-manrope para-14 bg-neutral-100 hover:bg-neutral-200 !duration-500 cursor-pointer"
                onClick={() => handleFilterChange(item)}
              >
                <p>{item.label}</p>
                <X className="text-black-500" size={16} strokeWidth={2} />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <motion.div
        className={`overflow-hidden px-[60px] duration-300 transition-none ${
          isCollapsed ? "pb-0" : "pb-4"
        }`}
        animate={{
          height: isCollapsed ? 0 : "auto",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        initial={false}
      >
        <div className="flex flex-col">
          {filter.filterList.map((f) => {
            return (
              <div
                key={`${f.key}-${filter.filterName}`}
                className="flex items-center gap-3 h-[48px]"
              >
                <Checkbox
                  id={`${f.key}-${filter.filterName}`}
                  checked={selectedItems.some((item) => item.key === f.key)}
                  onCheckedChange={() => handleFilterChange(f)}
                />
                <label
                  htmlFor={`${f.key}-${filter.filterName}`}
                  className="para-14 select-none font-medium font-manrope text-neutral-700 cursor-pointer"
                >
                  {f.label}
                </label>
              </div>
            );
          })}
          {filter.isFetchingNextPage && (
            <div className="flex justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {filter.hasNextPage && !filter.isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Button onClick={filter.fetchNextPage} variant={"default"}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
});

CustomDropdownFilter.displayName = "CustomDropdownFilter";

export default CustomDropdownFilter;
