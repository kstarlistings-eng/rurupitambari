import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface CustomCheckboxFieldProps {
  nameValue: string;
  labelValue?: string;
  className?: string;
  required?: boolean;
}

export default function CustomCheckboxField({
  nameValue,
  labelValue = "Remember me",
  className,
  required = false,
}: CustomCheckboxFieldProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameValue}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-0 space-y-0",
            className,
          )}
        >
          <FormLabel className="flex items-center cursor-pointer group">
            <FormControl>
              <Input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="w-[16px] h-[16px] input-shadow border border-neutral-200 text-green-600 rounded focus:ring-0 focus:ring-offset-0 cursor-pointer accent-green-600 !p-1"
                required={required}
              />
            </FormControl>
            <span className="ml-1 text-neutral-900 text-sm font-medium select-none">
              {labelValue}
              {required && <span className="text-red-500">*</span>}
            </span>
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
