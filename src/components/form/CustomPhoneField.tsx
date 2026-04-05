import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import InternationalPhonePicker from "./core/InternationalPhonePicker";

type Props = {
  nameValue: string;
  labelValue?: string;
  required?: boolean;
  labelClass?: string;
  formClassName?: string;
  disabled?: boolean;
};

function CustomPhoneField({
  nameValue,
  labelValue,
  required,
  labelClass,
  formClassName,
  disabled,
}: Props) {
  const form = useFormContext();
  return (
    <FormField
      name={nameValue}
      control={form.control}
      render={({ field }) => (
        <FormItem className={cn(`flex flex-col gap-2`, formClassName)}>
          {labelValue && (
            <FormLabel
              className={cn("para-14 text-neutral-crm-900 mb-[6px]", labelClass)}
            >
              {labelValue}
              {required && <span className="text-destructive-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <InternationalPhonePicker
              defaultValue={field?.value}
              onChange={(data) => {
                field?.onChange(data?.phone);
                form.setValue("country", data?.country?.iso2);
              }}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default CustomPhoneField;
