import { ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import SingleSelectCommand from "./SingleSelectCommand";

export interface SelectableItem {
  id: number;
  name: string;
}

export interface SingleSelectComboboxProps<
  T extends SelectableItem = SelectableItem,
> {
  options: T[];
  selected?: number | null;
  onSelectionChange: (selected: number | null) => void;
  placeholder?: string;
  className?: string;
  parentOpen?: boolean;
  isFetchingNextPage?: boolean;
  isPendingCategories?: boolean;
  hasNextPage?: boolean;
  ref: any;
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  initialSelectedItem?: SelectableItem | null;
}

export default function SingleSelectComboBox<
  T extends SelectableItem = SelectableItem,
>({
  options,
  selected = null,
  onSelectionChange,
  placeholder = "Select item...",
  className,
  parentOpen,
  isFetchingNextPage = false,
  isPendingCategories = false,
  hasNextPage = false,
  ref,
  searchTerm,
  setSearchTerm,
  initialSelectedItem = null,
}: SingleSelectComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectableItem | null>(null);

  useEffect(() => {
    if (selected === null) {
      setSelectedItem(null);
      return;
    }
    const found = options.find((opt) => opt.id === selected);
    if (found) {
      setSelectedItem(found);
    }
  }, [selected, options]);

  useEffect(() => {
    if (initialSelectedItem) {
      setSelectedItem(initialSelectedItem);
    }
  }, [initialSelectedItem]);

  const handleSelect = (value: { id: number; name: string }) => {
    if (selected === value.id) {
      onSelectionChange(null);
      setSelectedItem(null);
    } else {
      onSelectionChange(value.id);
      setSelectedItem(value);
    }
    setOpen(false);
  };

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (parentOpen === false) {
      setOpen(false);
    }
  }, [parentOpen]);

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              `w-full justify-between input-shadow h-[40px] rounded-[8px] px-3 py-1.5 font-normal hover:bg-white focus-visible:bg-white focus-visible:ring-0 border-neutral-200`,
              (isFocused || open) && "ring-[1.3px] ring-primary",
            )}
          >
            <span
              className={cn(
                "flex-1 text-left truncate",
                !selectedItem && "text-neutral-400",
              )}
            >
              {selectedItem ? selectedItem.name : placeholder}
            </span>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className="ml-2 h-4 w-4 opacity-50"
            >
              <ChevronDown width={50} height={50} />
            </motion.div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          style={{ width: "var(--radix-popover-trigger-width)" }}
          onCloseAutoFocus={(e) => e.preventDefault()}
          sideOffset={8}
        >
          <SingleSelectCommand
            ref={ref}
            onSelect={handleSelect}
            selected={selected}
            options={options}
            commandListClassName="max-h-[205px]"
            isFetchingNextPage={isFetchingNextPage}
            isPendingCategories={isPendingCategories}
            hasNextPage={hasNextPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
