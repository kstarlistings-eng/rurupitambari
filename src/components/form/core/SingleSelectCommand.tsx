import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchIcon } from "@/icons copy/otherIcons";
import { cn } from "@/lib/utils";
import type { SelectableItem } from "./SingleSelectCombBox";
import { Skeleton } from "@/components/ui/skeleton";

type Props<T extends SelectableItem> = {
  options?: T[];
  onSelect?: (value: T) => void;
  selected?: number | null;
  className?: string;
  commandInputBoxClassName?: string;
  commandInputClassName?: string;
  searchIconSize?: number;
  commandListClassName?: string;
  commandGroupClassName?: string;
  isFetchingNextPage?: boolean;
  isPendingCategories?: boolean;
  hasNextPage?: boolean;
  ref: any;
  searchTerm: string;
  setSearchTerm: (text: string) => void;
};

function SingleSelectCommand<T extends SelectableItem>({
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
  isPendingCategories = false,
  hasNextPage = false,
  ref,
  searchTerm,
  setSearchTerm,
}: Props<T>) {
  return (
    <Command className={cn(`w-full p-[10px]`, className)}>
      <div
        className={cn(
          `flex gap-2 items-center p-[10px] rounded-[8px] bg-neutral-50`,
          commandInputBoxClassName,
        )}
      >
        <SearchIcon size={searchIconSize} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className={cn(
            `p-0 h-fit text-black-400 placeholder:text-neutral-400 placeholder:font-medium bg-transparent border-none outline-none flex-1`,
            commandInputClassName,
          )}
        />
      </div>

      <CommandList
        className={cn(`scrollbar-hide max-h-[225px]`, commandListClassName)}
      >
        {isPendingCategories ? (
          <div className="flex flex-col gap-1 pt-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="flex items-center gap-3 w-full h-[34px]"
              />
            ))}
          </div>
        ) : (
          <>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup className={cn(``, commandGroupClassName)}>
              {options?.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => onSelect?.(option)}
                  className={cn(
                    "py-[10px] px-2 text-neutral-800 font-medium cursor-pointer w-full flex justify-between items-center",
                    selected === option.id &&
                      "[&>svg]:text-success-500 [&>svg]:opacity-100",
                  )}
                >
                  <span className="block">{option.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        <div ref={ref} className="flex flex-col gap-1 pt-4">
          {isFetchingNextPage ? (
            [...Array(2)].map((_, i) => (
              <Skeleton
                key={i}
                className="flex items-center gap-1 w-full h-[34px]"
              />
            ))
          ) : hasNextPage ? (
            <div className="h-1" />
          ) : (
            <p className="text-center text-xs text-neutral-500 py-2">
              No more options
            </p>
          )}
        </div>
      </CommandList>
    </Command>
  );
}

export default SingleSelectCommand;
