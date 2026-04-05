import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";

interface CustomTimeFieldProps<TFieldValues extends FieldValues = FieldValues> {
  nameValue: FieldPath<TFieldValues>;
  labelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  formItemClass?: string;
  labelClass?: string;
  isHorizontal?: boolean;
  defaultValue?: string;
  icon?: React.ReactNode;
}

const CustomTimeField = <TFieldValues extends FieldValues = FieldValues>({
  nameValue,
  labelValue,
  placeholder,
  disabled = false,
  required = false,
  className = "",
  formItemClass = "",
  labelClass = "",
  isHorizontal = false,
  icon,
}: CustomTimeFieldProps<TFieldValues>) => {
  const [isFocused, setIsFocused] = useState(false);
  const formInstance = useFormContext<TFieldValues>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenPicker = () => {
    if (disabled) return;
    try {
      inputRef.current?.showPicker();
    } catch (err) {
      inputRef.current?.click();
    }
  };

  return (
    <FormField
      control={formInstance.control}
      name={nameValue}
      render={({ field }) => {
        
        return (
        <>
        <FormItem className={cn(isHorizontal ? "flex items-center gap-4" : "", "h-fit", formItemClass)}>
          {labelValue && (
            <FormLabel
              className={cn(
                "text-neutral-900 text-sm font-medium block shrink-0",
                labelClass
              )}
            >
              {labelValue}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <div
              onClick={handleOpenPicker}
              className={cn(
                "relative flex w-full h-10 rounded-[8px] items-center border shadow-sm border-neutral-200 bg-white transition-all cursor-pointer",
                isFocused && "ring-[1.3px] ring-primary border-primary",
                disabled && "opacity-50 cursor-not-allowed",
                className
              )}
            >
              <Input
                {...field}
                type="time"
                ref={(e) => {
                  field.ref(e); // Sync with React Hook Form
                  (inputRef as any).current = e;
                }}
                onFocus={() => {
                  setIsFocused(true);
                  handleOpenPicker();
                }}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                  "border-none rounded-[8px] focus-visible:ring-0 px-3 py-3 h-full text-neutral-900 bg-transparent w-full cursor-pointer",
                  // Magic CSS: Stretches the native clickable "clock" icon to fill the entire input area
                  "[&::-webkit-calendar-picker-indicator]:absolute",
                  "[&::-webkit-calendar-picker-indicator]:left-0",
                  "[&::-webkit-calendar-picker-indicator]:top-0",
                  "[&::-webkit-calendar-picker-indicator]:w-full",
                  "[&::-webkit-calendar-picker-indicator]:h-full",
                  "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                  "[&::-webkit-calendar-picker-indicator]:opacity-0"
                )}
              />
              {icon && <div className="pr-3 pointer-events-none">{icon}</div>}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
        </>
      )
      }}
    />
  );
};

export default CustomTimeField;