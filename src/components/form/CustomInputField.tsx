import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useFormContext, type UseFormReturn } from "react-hook-form";
import type { FieldPath, FieldValues } from "react-hook-form";

interface CustomInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  nameValue: FieldPath<TFieldValues>; // ✅ Only valid field paths
  placeholder?: string;
  labelValue?: string;
  disabled?: boolean;
  form?: UseFormReturn<any>;
  type?: "textarea" | "text" | "email" | "number" | "tel" | "time";
  className?: string;
  readOnly?: boolean;
  required?: boolean;
  defaultValue?: string;
  isHorizontal?: boolean;
  formItemClass?: string;
  labelClass?: string;
  onChange?: (value: string) => void;
  showButton?: boolean;
  icon?: React.ReactNode;
  maxTextareaLimit?: number;
  inputPrefix?: string;
  customLabel?: React.ReactNode;
  autoFocus?: boolean;
}

const CustomInputField = <TFieldValues extends FieldValues = FieldValues>({
  nameValue,
  placeholder,
  labelValue,
  disabled = false,
  className = "",
  readOnly = false,
  required = false,
  type = "text",
  isHorizontal = false,
  formItemClass = "",
  labelClass = "",
  onChange,
  maxTextareaLimit,
  icon,
  inputPrefix,
  customLabel,
  autoFocus = false,
}: CustomInputFieldProps<TFieldValues>) => {
  const [isFocused, setIsFocused] = useState(false);
  const formInstance = useFormContext<TFieldValues>();

  return (
    <FormField
      control={formInstance.control}
      name={nameValue}
      render={({ field }) => {
        const currentLength =
          type === "textarea" ? (field.value?.length ?? 0) : 0;

        return (
          <FormItem
            className={cn(isHorizontal ? "flex" : "", "h-fit", formItemClass)}
          >
            {labelValue && (
              <FormLabel
                htmlFor={nameValue}
                className={cn(
                  "text-neutral-900 text-sm font-medium",
                  labelClass,
                )}
              >
                {labelValue}
                {required && <span className="text-red-500">*</span>}
                {customLabel}
              </FormLabel>
            )}
            <FormControl>
              {type === "textarea" ? (
                <div className="relative">
                  <Textarea
                    id={nameValue}
                    disabled={disabled}
                    className={cn(
                      "min-h-[120px] text-neutral-800 placeholder:text-neutral-400 rounded-[8px] shadow-none px-3 py-2 focus-visible:ring-1 focus-visible:ring-primary bg-white",
                      maxTextareaLimit && "pe-18",
                      className,
                    )}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value);
                      onChange?.(value);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  {maxTextareaLimit && (
                    <div className="absolute bg-white top-2 right-3 text-neutral-500 text-sm">
                      {currentLength}/{maxTextareaLimit}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2 items-center w-full">
                  {inputPrefix && (
                    <span className="text-neutral-600 para-14">
                      {inputPrefix}
                    </span>
                  )}
                  <div
                    className={cn(
                      "relative flex w-full rounded-[8px] items-center border border-neutral-200 input-shadow",
                      isFocused && "ring-[1.3px] ring-primary",
                      className,
                    )}
                  >
                    <Input
                      id={nameValue}
                      className="border-none rounded-[8px] focus-visible:ring-0 px-3 py-3 text-neutral-900 placeholder:text-neutral-400 h-[38px] bg-white"
                      min={0}
                      readOnly={readOnly}
                      disabled={disabled}
                      type={type}
                      placeholder={placeholder}
                      {...field}
                      onChange={(e) => {
                        field.onChange(
                          type === "number"
                            ? e.target.valueAsNumber
                            : e.target.value,
                        );
                        onChange?.(e.target.value);
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      autoFocus={autoFocus}
                    />
                    {icon}
                  </div>
                </div>
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CustomInputField;

//How to use it is shown below

/* 
<CustomInputField
    formItemClass="mt-2 placeholder:text-black-crm-200 mb-[18px]"
    labelClass="para-24 font-medium"
    labelValue="Category Name"
    nameValue="name"
    placeholder="e.g. Web Development"
    required
    className="!w-[94%]"
 />
 */
