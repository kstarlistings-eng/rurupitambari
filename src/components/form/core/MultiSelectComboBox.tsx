"use client";

import { ChevronDown, X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import MulitiSelectCommand from "./MultiSelectCommand";

export interface SelectableItem {
  id: number;
  name: string;
}

export interface MultiSelectComboboxProps<
  T extends SelectableItem = SelectableItem,
> {
  options: T[];
  selected?: number[];
  onSelectionChange: (selected: number[]) => void;
  placeholder?: string;
  className?: string;
  parentOpen?: boolean;
  isFetchingNextPage?: boolean;
  isPendingcategories?: boolean;
  hasNextPage?: boolean;
  ref: any;
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  initialSelectedItems?: SelectableItem[];
}

export default function MultiSelectComboBox<
  T extends SelectableItem = SelectableItem,
>({
  options,
  selected = [],
  onSelectionChange,
  placeholder = "Select items...",
  className,
  parentOpen,
  isFetchingNextPage = false,
  isPendingcategories = false,
  hasNextPage = false,
  ref,
  searchTerm,
  setSearchTerm,
  initialSelectedItems = [],
}: MultiSelectComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectableItem[]>([]);

  // Update selectedItems based on selected IDs and available options
  useEffect(() => {
    // Find items from options that match selected IDs
    const foundInOptions = options.filter((option) =>
      selected.includes(option.id),
    );

    // For items not found in options, keep existing selectedItems that are still selected
    const existingStillSelected = selectedItems.filter(
      (item) =>
        selected.includes(item.id) &&
        !foundInOptions.some((opt) => opt.id === item.id),
    );

    // Combine and deduplicate
    const combined = [...foundInOptions, ...existingStillSelected];
    const uniqueItems = combined.reduce((acc, item) => {
      if (!acc.some((i) => i.id === item.id)) acc.push(item);
      return acc;
    }, [] as SelectableItem[]);

    // Only keep items whose id is in selected
    const finalItems = uniqueItems.filter((item) => selected.includes(item.id));

    setSelectedItems(finalItems);
  }, [selected, options, selectedItems]); // Remove selectedItems from dependencies

  // Initialize with initialSelectedItems
  useEffect(() => {
    if (initialSelectedItems.length > 0) {
      setSelectedItems(initialSelectedItems);
    }
  }, [initialSelectedItems]);

  const handleSelect = (value: { id: number; name: string }) => {
    if (selected.includes(value.id)) {
      // Removing item
      onSelectionChange(selected.filter((id) => id !== value.id));
    } else {
      // Adding new item
      onSelectionChange([...selected, value.id]);
      // Immediately add to selectedItems for instant display
      setSelectedItems((prev) => {
        if (prev.some((item) => item.id === value.id)) return prev;
        return [...prev, value];
      });
    }
  };

  const handleRemove = (value: { id: number; name: string }) => {
    onSelectionChange(selected.filter((item) => item !== value.id));
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
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              `w-full justify-between h-fit px-3 py-2`,
              (isFocused || open) && "ring-1 ring-primary-crm",
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedItems.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedItems.map((option, index) => (
                  <Badge
                    key={`${option.id}-${index}`}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {option.name}
                    <div
                      className="ml-1 rounded-full hover:bg-neutral-crm-100 p-0.5 duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(option);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </div>
                  </Badge>
                ))
              )}
            </div>
            <motion.div
              animate={{
                rotate: open ? 180 : 0,
              }}
              transition={{
                duration: 0.1,
                ease: "linear",
              }}
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
        >
          <MulitiSelectCommand
            ref={ref}
            onSelect={handleSelect}
            selected={selected}
            options={options}
            commandListClassName="max-h-[205px]"
            isFetchingNextPage={isFetchingNextPage}
            isPendingcategories={isPendingcategories}
            hasNextPage={hasNextPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
