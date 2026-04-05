import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useQuery } from "@tanstack/react-query";
import { Info, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormContext, type UseFormReturn } from "react-hook-form";
import { authInstance } from "@/config/axios-interceptor";

type CustomerOption = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

type Props = {
  nameValue: string;
  form: UseFormReturn<any, any, any>;
  defaultCustomer?: CustomerOption | null;
};

const CustomerSearchField = ({ nameValue, form, defaultCustomer }: Props) => {
  const { setValue, register } = useFormContext();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [wasCleared, setWasCleared] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebouncedValue(search, 400);
  useEffect(() => {
    if (defaultCustomer && !wasCleared) {
      setSelectedCustomer(defaultCustomer);
    }
  }, [defaultCustomer, wasCleared]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: customers = [], isLoading } = useQuery<any>({
    queryKey: ["customer-search", debouncedSearch],
    queryFn: async () => {
      const response = await authInstance.get(
        `/branch/customers/?search=${debouncedSearch}`,
      );
      return response.results;
    },
    enabled: debouncedSearch.length >= 2,
  });

  const handleClear = () => {
    setSelectedCustomer(null);
    setIsNewCustomer(false);
    setWasCleared(true); // prevent useEffect from re-setting
    setValue(nameValue, "");
    setValue("new_customer_first_name", "");
    setValue("new_customer_last_name", "");
    setValue("phone_number", "");
    setSearch("");
  };

  const handleSelect = (customer: CustomerOption) => {
    setSelectedCustomer(customer);
    setIsNewCustomer(false);
    setWasCleared(false); // allow future defaultCustomer sync
    setValue(nameValue, customer.id.toString());
    setValue("new_customer_first_name", customer.first_name);
    setValue("new_customer_last_name", customer.last_name);
    setValue("phone_number", customer.phone_number);
    setSearch("");
    setIsOpen(false);
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setIsNewCustomer(true);
    setWasCleared(true);
    setValue(nameValue, "");
    setValue("new_customer_first_name", "");
    setValue("new_customer_last_name", "");
    setValue("phone_number", "");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="space-y-3">
      <div className="relative">
        <label className="text-sm font-medium mb-1 block">
          Search Customer{" "}
          <span className="text-gray-400">(Name or Phone No.)</span>
        </label>

        {selectedCustomer ? (
          <div className="flex items-center gap-3 border-2 border-dashed border-green-300 rounded-xl px-4 py-3 bg-green-50">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full shrink-0">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                Customer Found: {selectedCustomer.first_name}{" "}
                {selectedCustomer.last_name}
              </p>
              <p className="text-sm text-gray-500">
                {selectedCustomer.phone_number}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value.toString());
                setIsOpen(true);
                if (isNewCustomer) setIsNewCustomer(false);
              }}
              onFocus={() => search.length >= 2 && setIsOpen(true)}
              placeholder="Enter name or phone number"
              className="w-full border bg-white shadow-sm rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-1 focus:ring-primary-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
            </div>
          </div>
        )}

        {form?.formState?.errors[nameValue] && (
          <p className="text-sm text-red-500 mt-1">
            {form?.formState?.errors[nameValue]?.message as string}
          </p>
        )}

        {isOpen && debouncedSearch.length >= 2 && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="px-3 py-4 text-sm text-gray-400 text-center flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Searching...
              </div>
            ) : (
              <>
                {customers.map((customer: any) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => handleSelect(customer)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b last:border-b-0"
                  >
                    <span className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </span>
                    <span className="text-gray-400 ml-2">
                      {customer.phone_number}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleNewCustomer}
                  className="w-full text-left px-3 py-2 hover:bg-amber-50 text-sm text-amber-600 font-medium border-t"
                >
                  + Add as new customer
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* New Customer Form */}
      {isNewCustomer && (
        <div className="border-2 border-dashed border-amber-300 rounded-xl px-4 py-4 bg-amber-50 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-amber-500 rounded-full shrink-0">
              <Info size={16} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-800">New Customer?</p>
            <button
              type="button"
              onClick={handleClear}
              className="ml-auto text-gray-400 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Customer first name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("new_customer_first_name")}
                placeholder="First name"
                className="w-full border bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-500"
              />
              {form?.formState?.errors.new_customer_first_name && (
                <p className="text-sm text-red-500 mt-1">
                  {
                    form?.formState?.errors?.new_customer_first_name
                      ?.message as string
                  }
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Customer last name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("new_customer_last_name")}
                placeholder="Last name"
                className="w-full border bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-500"
              />
              {form?.formState?.errors.new_customer_last_name && (
                <p className="text-sm text-red-500 mt-1">
                  {
                    form?.formState?.errors?.new_customer_last_name
                      ?.message as string
                  }
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Customer Phone <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phone_number")}
                placeholder="Phone number"
                className="w-full border bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary-500"
              />
              {form?.formState?.errors.phone_number && (
                <p className="text-sm text-red-500 mt-1">
                  {form?.formState?.errors?.phone_number?.message as string}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSearchField;
