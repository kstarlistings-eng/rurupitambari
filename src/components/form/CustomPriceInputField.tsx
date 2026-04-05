import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { FieldPath, FieldValues } from "react-hook-form";

interface CurrencyOption {
  code: string; // e.g. "NPR"
  symbol: string; // e.g. "NRs."
  label: string; // e.g. "Nepali Rupees"
}

export const DEFAULT_CURRENCIES: CurrencyOption[] = [
  { code: "NPR", symbol: "NRs.", label: "Nepali Rupees" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupees" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
];

interface CustomPriceFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  /** Form field name for the price/amount value (number) */
  priceNameValue: FieldPath<TFieldValues>;
  /** Form field name for the currency code (string, e.g. "NPR") */
  currencyNameValue: FieldPath<TFieldValues>;
  labelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  formItemClass?: string;
  labelClass?: string;
  readOnly?: boolean;
  /** Custom currency options (defaults to common currencies) */
  currencies?: CurrencyOption[];
  /** Called when price changes */
  onPriceChange?: (value: number | string) => void;
  /** Called when currency changes */
  onCurrencyChange?: (value: string) => void;
  customLabel?: React.ReactNode;
}

const CustomPriceField = <TFieldValues extends FieldValues = FieldValues>({
  priceNameValue,
  currencyNameValue,
  labelValue,
  placeholder = "Enter Amount",
  disabled = false,
  required = false,
  className = "",
  formItemClass = "",
  labelClass = "",
  readOnly = false,
  currencies = DEFAULT_CURRENCIES,
  onPriceChange,
  onCurrencyChange,
  customLabel,
}: CustomPriceFieldProps<TFieldValues>) => {
  const [isFocused, setIsFocused] = useState(false);
  const formInstance = useFormContext<TFieldValues>();

  const getCurrencyByCode = (code: string) =>
    currencies.find((c) => c.code === code) ?? currencies[0];

  return (
    <FormField
      control={formInstance.control}
      name={priceNameValue}
      render={({ field: priceField }) => {
        // Read currency value directly from form state
        const currencyValue = formInstance.watch(currencyNameValue) as string;
        const activeCurrency = getCurrencyByCode(currencyValue);

        return (
          <FormItem className={cn("h-fit", formItemClass)}>
            {labelValue && (
              <FormLabel
                htmlFor={priceNameValue}
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
              <div
                className={cn(
                  "relative flex w-full rounded-[8px] items-center border border-neutral-200 input-shadow bg-white overflow-hidden",
                  isFocused && "ring-[1.3px] ring-primary",
                  disabled && "opacity-50 cursor-not-allowed",
                  className,
                )}
              >
                {/* Currency symbol prefix */}
                <span className="shrink-0 border-r border-neutral-200 px-3 py-2 text-neutral-600 text-sm select-none bg-neutral-50">
                  {activeCurrency.symbol}
                </span>

                {/* Amount input */}
                <Input
                  id={priceNameValue}
                  type="number"
                  min={0}
                  step="any"
                  className="border-none rounded-none focus-visible:ring-0 px-3 py-3 text-neutral-900 placeholder:text-neutral-400 h-[38px] bg-white flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  {...priceField}
                  onChange={(e) => {
                    const val =
                      e.target.value === "" ? "" : e.target.valueAsNumber;
                    priceField.onChange(val);
                    onPriceChange?.(val);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />

                {/* Currency dropdown — bound to currencyNameValue */}
                <FormField
                  control={formInstance.control}
                  name={currencyNameValue}
                  render={({ field: currencyField }) => (
                    <Select
                      value={currencyField.value}
                      onValueChange={(val) => {
                        currencyField.onChange(val);
                        onCurrencyChange?.(val);
                      }}
                      disabled={disabled}
                    >
                      <SelectTrigger className="shrink-0 border-none rounded-none h-[38px] w-auto gap-1.5 px-3 text-neutral-700 text-sm focus:ring-0 shadow-none bg-transparent hover:bg-neutral-50 cursor-pointer focus-visible:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end" className="p-2">
                        {currencies.map((c) => (
                          <SelectItem
                            className="cursor-pointer rounded p-1"
                            key={c.code}
                            value={c.code}
                          >
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </FormControl>
            {/* Shows validation error for the price field */}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CustomPriceField;

// ============================================================
// HOW TO USE
// ============================================================
//
// Two separate form fields: one for price (number), one for currency (string).
//
// 1) Basic usage:
//
//   <CustomPriceField
//     priceNameValue="sellingPrice"
//     currencyNameValue="currency"
//     labelValue="Selling Price"
//     required
//   />
//
// 2) With change callbacks:
//
//   <CustomPriceField
//     priceNameValue="sellingPrice"
//     currencyNameValue="currency"
//     labelValue="Selling Price"
//     required
//     onPriceChange={(val) => console.log("price:", val)}     // 1500
//     onCurrencyChange={(val) => console.log("currency:", val)} // "USD"
//   />
//
// 3) Zod schema example:
//
//   const schema = z.object({
//     sellingPrice: z
//       .number({ required_error: "Price is required" })
//       .positive("Price must be greater than 0"),
//     currency: z.string().min(1, "Currency is required"),
//   });
//
// 4) Default values in useForm:
//
//   const form = useForm({
//     defaultValues: {
//       sellingPrice: "",
//       currency: "NPR",
//     },
//   });
//
