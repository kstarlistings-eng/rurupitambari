import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  nameValue: FieldPath<TFieldValues>;
  labelValue?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export default function PasswordInputField<
  TFieldValues extends FieldValues = FieldValues,
>({
  nameValue,
  labelValue = "Password",
  placeholder = "•••••••••",
  className,
  required = false,
}: PasswordInputFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useFormContext<TFieldValues>();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <FormField
      control={form.control}
      name={nameValue}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col gap-2 h-fit", className)}>
          {labelValue && (
            <FormLabel className="text-neutral-900 text-sm font-medium">
              {labelValue}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <div className="relative">
            <FormControl>
              <div>
                <Input
                  className="focus-visible:ring-1 focus-visible:ring-primary placeholder:text-neutral-400  input-shadow border border-neutral-200 !p-4 rounded-[8px] text-neutral-900"
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                  {...field}
                />
              </div>
            </FormControl>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute shadow-none bg-transparent right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {!showPassword ? (
                <EyeOff className="h-4 w-4 text-neutral-500" />
              ) : (
                <Eye className="h-4 w-4 text-neutral-500" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
