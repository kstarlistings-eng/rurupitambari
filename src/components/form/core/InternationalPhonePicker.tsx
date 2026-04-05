import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  type ParsedCountry,
  usePhoneInput,
} from "react-international-phone";
import "react-international-phone/style.css";
import CustomCommand from "../../custom-ui/CustomCommand";
import { cn } from "@/lib/utils";

const allCountries = defaultCountries.map((countryData) =>
  parseCountry(countryData),
);

type InternationalPhonePickerProps = {
  onChange: (data: {
    phone: string;
    inputValue: string;
    country: ParsedCountry;
  }) => void;
  defaultValue?: string;
  disabled?: boolean;
};

export default function InternationalPhonePicker({
  onChange,
  defaultValue = "+977",
  disabled,
}: InternationalPhonePickerProps) {
  const [open, setOpen] = useState(false);
  const { inputValue, country, setCountry, handlePhoneValueChange, inputRef } =
    usePhoneInput({
      defaultCountry: "np",
      value: defaultValue ?? "",
      onChange: (data) => {
        if (data && data?.country && typeof data?.phone === "string") {
          onChange(data);
        }
      },
    });

  const [isFocused, setIsFocused] = useState(false);
  return (
    <div
      className={cn(
        "flex items-center rounded-[8px] overflow-hidden border border-transparent",
        isFocused ? "ring-[1.3px] ring-primary" : "border-neutral-200",
      )}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-0.5 p-1 ps-2.5 bg-neutral-100 ">
            <FlagImage iso2={country.iso2} size={18} className="size-[12px]" />
            <motion.div
              animate={{
                rotate: open ? 180 : 0,
              }}
              transition={{
                duration: 0.1,
                ease: "linear",
              }}
              className="h-6 w-6 opacity-50 origin-center items-center justify-center flex"
            >
              <ChevronDown size={16} />
            </motion.div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-full border border-border-crm rounded-[8px] p-0"
          align="start"
        >
          <CustomCommand>
            {allCountries.map((c) => (
              <CustomCommand.Item
                key={c.iso2}
                onSelect={() => {
                  setCountry(c.iso2);
                  setOpen(false);
                }}
                value={`${c.name.toLowerCase()} ${c.dialCode} ${c.iso2}`}
                className={
                  "py-[10px] px-2 text-black-crm-300 font-medium cursor-pointer" +
                  (country.iso2 === c.iso2
                    ? " bg-neutral-crm-50 text-black"
                    : "")
                }
              >
                <div className="flex items-center gap-2">
                  <FlagImage iso2={c.iso2} className="w-4 h-3" />
                  <span>{c.name}</span>
                  <span className="ml-auto text-muted-foreground">
                    +{c.dialCode}
                  </span>
                </div>
              </CustomCommand.Item>
            ))}
          </CustomCommand>
        </PopoverContent>
      </Popover>
      {/* Phone Input */}
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handlePhoneValueChange}
        placeholder="Enter phone number"
        className="placeholder:text-neutral-400 rounded-none rounded-br-[8px] rounded-tr-[8px] p-3 focus-visible:ring-0 border-none bg-white focus-visible:outline-none"
        name="phone"
        disabled={disabled}
      />
    </div>
  );
}
