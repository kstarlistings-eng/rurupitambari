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
import { useRef, useState } from "react";
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
  options?: T[];
  onSelectionChange?: MultiSelectComboboxProps<T>["onSelectionChange"];
  selected?: MultiSelectComboboxProps<T>["selected"];
  parentOpen?: MultiSelectComboboxProps<T>["parentOpen"];
  initialSelectedItems?: SelectableItem[];
}

export function CustomMultiSelectOptions<
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
  options = [],
  placeholder,
  initialSelectedItems = [],
  ...multiSelectProps
}: Props<T>) {
  const form = useFormContext();
  const ref = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

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
              ref={ref}
              placeholder={placeholder}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSelectionChange={(selectedOptions) => {
                field.onChange(selectedOptions);
              }}
              selected={field.value || []}
              options={options}
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
