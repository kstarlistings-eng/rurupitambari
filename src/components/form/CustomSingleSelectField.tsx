import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import SingleSelectComboBox, {
  type SingleSelectComboboxProps,
  type SelectableItem,
} from "./core/SingleSelectCombBox";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Category } from "@/types/category";
import { authInstance } from "@/config/axios-interceptor";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";

interface Props<T extends SelectableItem = SelectableItem> {
  nameValue: string;
  labelValue?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  comboBoxClassName?: string;
  formClassName?: string;
  isParentOpen?: boolean;
  invalidateQueryKey?: string;
  categoryEndpoint?: string;
  LIMIT?: number;
  onSelectionChange?: SingleSelectComboboxProps<T>["onSelectionChange"];
  selected?: SingleSelectComboboxProps<T>["selected"];
  parentOpen?: SingleSelectComboboxProps<T>["parentOpen"];
  mapOption?: (item: any) => SelectableItem;
  initialSelectedItem?: SelectableItem | null;
}

export function CustomSingleSelectField<
  T extends SelectableItem = SelectableItem,
>({
  nameValue,
  labelValue,
  required,
  className,
  labelClassName,
  comboBoxClassName,
  formClassName,
  isParentOpen,
  invalidateQueryKey = "",
  categoryEndpoint = "",
  LIMIT = 8,
  placeholder,
  mapOption,
  initialSelectedItem = null,
  ...singleSelectProps
}: Props<T>) {
  const form = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPending: isPendingCategories,
  } = useInfiniteQuery({
    queryKey: [invalidateQueryKey, debouncedSearchTerm],
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const queryParams = {
        page: pageParam as number,
        size: LIMIT,
        search: debouncedSearchTerm,
      };
      const response: PaginatedResponse<Category[]> = await authInstance.get(
        `${categoryEndpoint}`,
        { params: queryParams },
      );
      return {
        items: response.results,
        next: response.next,
        count: response.count,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  const flatOptions =
    data?.pages.flatMap((page) =>
      page.items.map(mapOption ? (mapOption as any) : (item) => item),
    ) || [];

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <FormField
      name={nameValue}
      control={form.control}
      render={({ field }) => (
        <FormItem className={className}>
          {labelValue && (
            <FormLabel
              className={cn(
                `text-sm text-neutral-900 font-medium`,
                labelClassName,
              )}
            >
              {labelValue}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl className={cn(``, formClassName)}>
            <SingleSelectComboBox<T>
              placeholder={placeholder}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isFetchingNextPage={isFetchingNextPage}
              isPendingCategories={isPendingCategories}
              hasNextPage={hasNextPage}
              ref={ref}
              onSelectionChange={(selectedId) => {
                field.onChange(selectedId);
              }}
              selected={field.value ?? null}
              options={flatOptions as any}
              parentOpen={isParentOpen}
              initialSelectedItem={initialSelectedItem}
              {...singleSelectProps}
              className={cn(``, comboBoxClassName)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
