import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CustomSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  nameValue: FieldPath<TFieldValues>;
  placeholder?: string;
  labelValue?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  defaultValue?: string;
  formItemClass?: string;
  labelClass?: string;
  onChange?: (value: string | undefined) => void;
  options: { label: string; value: string }[];
  isLoading?: boolean;
  unSelectName?: string
}

function CustomSelectField<TFieldValues extends FieldValues = FieldValues>(
  props: CustomSelectFieldProps<TFieldValues>,
) {
  const form = useFormContext<TFieldValues>();
  console.log("CustomSelectField Rendered with value:", props.options);

  return (
    <FormField
      control={form.control}
      name={props.nameValue}
      render={({ field }) => {
        return (
          <FormItem
            className={cn(
              "flex flex-col gap-2 w-full h-fit",
              props.formItemClass,
            )}
          >
            {props.labelValue && (
              <FormLabel
                className={cn(
                  "text-sm font-medium text-neutral-900",
                  props.labelClass,
                )}
              >
                {props.labelValue}{" "}
                {props.required && <span className="text-red-500">*</span>}
              </FormLabel>
            )}
            <FormControl className="!m-0">
              <Select
                value={String(field.value)}
                onValueChange={(value) => {
                  const newValue = value === "none"  ? undefined : value;
                  field.onChange(newValue);
                  props?.onChange?.(newValue);
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full focus:ring-primary !h-[40px] focus-visible:ring-primary focus-visible:ring-1 input-shadow border-main bg-white  rounded-[8px]",
                    props.className,
                  )}
                  disabled={props.disabled}
                >
                  <SelectValue
                    className="h-full m-0 border-none"
                    placeholder={props?.placeholder}
                  />
                </SelectTrigger>
                <SelectContent className="p-1">
                  <SelectGroup>
                    <SelectLabel>{props.labelValue}</SelectLabel>
                     {props.options.length == 0 ?  (
                      /* Empty State */
                      <>
                      <SelectItem value="none" className="py-6 text-center text-sm text-muted-foreground">
                        No options available.
                      </SelectItem>
                      </>
                     ) : (
                      <>
                      <SelectItem value="none" className="cursor-pointer bg-red-50 text-red-600 hover:!bg-red-50 hover:!text-red-600">
                        <X/> {props.unSelectName || "clear"}
                      </SelectItem>
                      {props.options.map((opt) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={opt.value}
                          value={String(opt.value)}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                      </>
                    )} 
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default CustomSelectField;
