import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import MultiSelectComboBox, {
  type MultiSelectComboboxProps,
  type SelectableItem,
} from "./core/MultiSelectComboBox";
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
  MultiBoxClassName?: string;
  formClassName?: string;
  isParentOpen?: boolean;
  options?: any[];
  invalidateQueryKey?: string;
  categoryEndpoint?: string;
  LIMIT?: number;
  onSelectionChange?: MultiSelectComboboxProps<T>["onSelectionChange"];
  selected?: MultiSelectComboboxProps<T>["selected"];
  parentOpen?: MultiSelectComboboxProps<T>["parentOpen"];
  mapOption?: (item: any) => SelectableItem;
  initialSelectedItems?: SelectableItem[];
}

export function CustomMultiSelectField<
  T extends SelectableItem = SelectableItem,
>({
  nameValue,
  labelValue,
  required,
  className,
  labelClassName,
  MultiBoxClassName,
  formClassName,
  isParentOpen,
  options,
  invalidateQueryKey = "",
  categoryEndpoint = "",
  LIMIT = 8,
  placeholder,
  mapOption,
  initialSelectedItems = [],
  ...multiSelectProps
}: Props<T>) {
  const form = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPending: isPendingcategories,
  } = useInfiniteQuery({
    queryKey: [invalidateQueryKey, debouncedSearchTerm],
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const queryParams = {
        page: pageParam as number,
        size: LIMIT,
        search: debouncedSearchTerm,
      };
      const categories: PaginatedResponse<Category[]> = await authInstance.get(
        `${categoryEndpoint}`,
        { params: queryParams },
      );

      return {
        categories: categories.results,
        next: categories.next,
        count: categories.count,
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

  const categoryFlatDataOption =
    data?.pages.flatMap((page) =>
      page.categories.map(mapOption ? (mapOption as any) : (item) => item),
    ) || [];

  const { ref, inView } = useInView({
    threshold: 0,
  });

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
              className={cn(`para-14 text-neutral-crm-900`, labelClassName)}
            >
              {labelValue}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl className={cn(``, formClassName)}>
            <MultiSelectComboBox<T>
              placeholder={placeholder}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isFetchingNextPage={isFetchingNextPage}
              isPendingcategories={isPendingcategories}
              hasNextPage={hasNextPage}
              ref={ref}
              onSelectionChange={(selectedOptions) => {
                field.onChange(selectedOptions);
              }}
              selected={field.value || []}
              options={categoryFlatDataOption as any}
              parentOpen={isParentOpen}
              initialSelectedItems={initialSelectedItems}
              {...multiSelectProps}
              className={cn(``, MultiBoxClassName)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
