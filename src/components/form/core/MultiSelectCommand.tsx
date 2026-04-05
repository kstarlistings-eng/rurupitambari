import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchIcon } from "@/icons copy/otherIcons";
import { cn } from "@/lib/utils";
import React from "react";
import { Check } from "lucide-react";
import type { SelectableItem } from "./MultiSelectComboBox";
import { Skeleton } from "@/components/ui/skeleton";

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
  isFetchingNextPage?: boolean;
  isPendingcategories?: boolean;
  hasNextPage?: boolean;
  ref: any;
  searchTerm: string;
  setSearchTerm: (text: string) => void;
};

function MulitiSelectCommand<T extends SelectableItem>({
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
  isFetchingNextPage = false,
  isPendingcategories = false,
  hasNextPage = false,
  ref,
  searchTerm,
  setSearchTerm,
}: Props<T>) {
  //   const [searchTerm, setSearchTerm] = useState("");
  return (
    <Command className={cn(`w-full p-[10px]`, className)}>
      <div
        className={cn(
          `flex gap-2 items-center bg-neutral-crm-50 p-[10px] rounded-[8px]`,
          commandInputBoxClassName,
        )}
      >
        <SearchIcon size={searchIconSize} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Category..."
          className={cn(
            `p-0 h-fit text-black-crm-400 placeholder:text-neutral-crm-400 placeholder:font-medium bg-transparent border-none outline-none flex-1`,
            commandInputClassName,
          )}
        />
      </div>
      {/* <div
        className={cn(
          `flex gap-2 items-center bg-neutral-crm-50 p-[10px] rounded-[8px]`,
          commandInputBoxClassName
        )}
      >
        <SearchIcon size={searchIconSize} />
        <CommandInput
          onValueChange={(text) => setSearchTerm(text)}
          placeholder="Search Category..."
          className={cn(
            `p-0 h-fit text-black-crm-400 placeholder:text-neutral-crm-400 placeholder:font-medium`,
            commandInputClassName
          )}
          hideIcon={true}
          boxClassName="border-none p-0 h-fit"
        />
      </div> */}

      <CommandList
        className={cn(`scrollbar-hide max-h-[225px]`, commandListClassName)}
      >
        {isPendingcategories ? (
          <div className="flex flex-col gap-4 pt-4 ">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="flex items-center gap-3 w-full h-[34px]"
              ></Skeleton>
            ))}
          </div>
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
                        "py-[10px] px-2 text-black-crm-300 font-medium cursor-pointer w-full flex justify-between items-center" +
                        (selected?.includes(option.id)
                          ? " bg-neutral-crm-50 text-black"
                          : "")
                      }
                    >
                      <span> {option.name}</span>{" "}
                      {selected?.includes(option.id) ? (
                        <Check className="text-primary-crm" />
                      ) : (
                        ""
                      )}
                    </CommandItem>
                  ))}
            </CommandGroup>
          </>
        )}

        <div ref={ref} className="flex flex-col gap-4 pt-4 ">
          {isFetchingNextPage ? (
            [...Array(2)].map((_, i) => (
              <Skeleton
                key={i}
                className="flex items-center gap-3 w-full h-[34px]"
              ></Skeleton>
            ))
          ) : hasNextPage ? (
            // Keep the sentinel in DOM to trigger IntersectionObserver,
            // even when not fetching, but show nothing.
            <div className="h-1" />
          ) : (
            <p className="text-center text-xs text-neutral-500 py-2">
              No more categories
            </p>
          )}
        </div>
      </CommandList>
    </Command>
  );
}

MulitiSelectCommand.Item = function MulitiSelectCommandItem({
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

export default MulitiSelectCommand;
