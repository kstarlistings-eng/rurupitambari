import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchIcon } from "@/icons copy/otherIcons";
import { cn } from "@/lib/utils";
import React from "react";
import { type SelectableItem } from "../form/core/MultiSelectComboBox";
import { Loader2 } from "lucide-react";

type Props<T extends SelectableItem> = {
  children?: React.ReactNode;
  options?: T[];
  onSelect?: (value: T) => void;
  selected?: number[] | null;
  className?: string;
  commandInputBoxClassName?: string;
  commandInputClassName?: string;
  searchIconSize?: number;
  commandListClassName?: string;
  commandGroupClassName?: string;
  isLoading?: boolean;
};

function CustomCommand<T extends SelectableItem>({
  children,
  options,
  onSelect,
  selected,
  className,
  commandInputBoxClassName,
  commandInputClassName,
  searchIconSize,
  commandListClassName,
  commandGroupClassName,
  isLoading = false,
}: Props<T>) {
  return (
    <Command className={cn(`w-full p-[10px]`, className)}>
      <div
        className={cn(
          `flex gap-2 items-center bg-neutral-crm-50 p-[10px] rounded-[8px]`,
          commandInputBoxClassName,
        )}
      >
        <SearchIcon size={searchIconSize} />
        <CommandInput
          placeholder="Search Category..."
          className={cn(
            `p-0 h-fit text-black-crm-400 placeholder:text-neutral-crm-400 placeholder:font-medium`,
            commandInputClassName,
          )}
          hideIcon={true}
          boxClassName="border-none p-0 h-fit"
        />
      </div>

      <CommandList
        className={cn(`scrollbar-hide max-h-[225px]`, commandListClassName)}
      >
        {isLoading ? (
          <Loader2 className="mx-auto my-4 animate-spin" />
        ) : (
          <>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup className={cn(``, commandGroupClassName)}>
              {children
                ? children
                : options?.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => {
                        onSelect?.(option);
                      }}
                      className={
                        "py-[10px] px-2 text-black-crm-300 font-medium cursor-pointer" +
                        (selected?.includes(option.id)
                          ? " bg-neutral-crm-50 text-black"
                          : "")
                      }
                    >
                      {option.name}
                    </CommandItem>
                  ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}

CustomCommand.Item = function CustomCommandItem({
  children,
  value,
  className,
  ...props
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
} & React.ComponentProps<typeof CommandItem>) {
  return (
    <CommandItem
      key={value}
      value={value}
      className={
        "py-[10px] px-2 text-black-crm-300 font-medium cursor-pointer " +
        className
      }
      {...props}
    >
      {children}
    </CommandItem>
  );
};

export default CustomCommand;
