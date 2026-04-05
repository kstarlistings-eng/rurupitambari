"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface BaseFormProps {
  nameValue: string;
  labelValue: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  formClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

type Props = {
  /** Date format string (date-fns), default "PPP" */
  dateFormat?: string;
  /** Minimum selectable date */
  fromDate?: Date;
  /** Maximum selectable date */
  toDate?: Date;
  /** Disable dates before today */
  disablePast?: boolean;
  /** Disable dates after today */
  disableFuture?: boolean;
  /** Custom disabled date matcher */
  disabledDates?: (date: Date) => boolean;
  /** Calendar alignment, default "start" */
  align?: "start" | "center" | "end";
  disablePickingDate?: boolean;
} & BaseFormProps;

function CustomDatePicker({
  nameValue,
  labelValue,
  required = false,
  formClassName,
  labelClassName,
  inputClassName,
  disabled = false,
  placeholder = "Pick a date",
  dateFormat = "PPP",
  fromDate,
  toDate,
  disablePast = false,
  disableFuture = false,
  disabledDates,
  align = "start",
  disablePickingDate = false,
}: Props) {
  const form = useFormContext();

  const getDisabledMatcher = () => {
    const matchers: ((date: Date) => boolean)[] = [];

    if (disablePast) {
      matchers.push(
        (date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0)),
      );
    }
    if (disableFuture) {
      matchers.push((date: Date) => date > new Date());
    }
    if (fromDate) {
      matchers.push(
        (date: Date) =>
          date.setHours(0, 0, 0, 0) <= new Date(fromDate).setHours(0, 0, 0, 0),
      );
    }
    if (toDate) {
      matchers.push(
        (date: Date) =>
          date.setHours(0, 0, 0, 0) >= new Date(toDate).setHours(0, 0, 0, 0),
      );
    }
    if (disabledDates) {
      matchers.push(disabledDates);
    }

    if (matchers.length === 0) return undefined;
    return (date: Date) => matchers.some((fn) => fn(date));
  };

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name={nameValue}
      render={({ field, fieldState }) => (
        <FormItem className={cn("flex flex-col gap-2 w-full", formClassName)}>
          {labelValue && (
            <FormLabel
              htmlFor={nameValue}
              className={cn(
                "text-sm font-medium text-neutral-900 ",
                labelClassName,
              )}
            >
              {labelValue}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Popover
              onOpenChange={disablePickingDate ? undefined : setIsOpen}
              open={isOpen && !disablePickingDate}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  id={nameValue}
                  disabled={disabled || disablePickingDate}
                  className={cn(
                    "w-full h-10 pl-4 pr-3 rounded-md border border-neutral-200 bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary justify-start font-normal hover:bg-white flex items-center cursor-pointer input-shadow",
                    !field.value && "text-gray-400",
                    disabled && "bg-gray-300 cursor-not-allowed",
                    disablePickingDate && "cursor-not-allowed",
                    fieldState.error &&
                      " focus-visible:ring-red-500 ring-1 ring-red-500",
                    inputClassName,
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 shrink-0" />
                  {field.value ? (
                    format(new Date(field.value), dateFormat)
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 overflow-auto"
                align={align}
                side="bottom"
                sideOffset={4}
              >
                <Calendar
                  mode="single"
                  className="p-3 mx-auto"
                  classNames={{
                    month_grid: "w-full border-collapse space-y-1",
                    weekdays: "flex",
                    button_next:
                      "hover:bg-primary/20 cursor-pointer rounded-md p-2",
                    month_caption: "text-center text-sm font-medium mt-1",
                    button_previous:
                      "hover:bg-primary/20 cursor-pointer rounded-md p-2",
                    weekday:
                      "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                    week: "flex w-full mt-2",
                    day: "h-9 w-9 text-center text-sm p-0 relative flex items-center justify-center",
                    day_button:
                      "h-8 w-8 p-0 font-normal rounded-md cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors shadow-none",
                    selected:
                      "[&>button]:bg-primary [&>button]:text-white [&>button]:hover:bg-primary [&>button]:hover:text-white [&>button]:focus:bg-primary [&>button]:focus:text-white",
                    today: "[&>button]:bg-gray-100 [&>button]:text-gray-900",
                    outside: "[&>button]:text-gray-300 [&>button]:opacity-50",
                    disabled:
                      "[&>button]:text-gray-300 [&>button]:opacity-50 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent",
                  }}
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(
                      date ? format(date, "yyyy-MM-dd") : undefined,
                    );
                    setIsOpen(false);
                  }}
                  defaultMonth={field.value ? new Date(field.value) : undefined}
                  startMonth={fromDate}
                  endMonth={toDate}
                  disabled={getDisabledMatcher()}
                  captionLayout="dropdown"
                  autoFocus
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomDatePicker;
