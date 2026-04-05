import CustomInputField from "@/components/form/CustomInputField";
import { CustomSingleSelectField } from "@/components/form/CustomSingleSelectField";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { branchEndpoints } from "@/config/endpoints";
import useProductFormActions from "../useProductFormActions";
import { Controller } from "react-hook-form";
import CustomSelectField from "@/components/form/CustomSelectField";
import CustomDatePicker from "@/components/form/CustomDateField";
import { ProductUnitEnum } from "@/schema/(branchSchema)/catalog/ProductSchema";
import CustomPriceField from "@/components/form/CustomPriceInputField";

type Props = {
  form: ReturnType<typeof useProductFormActions>["form"];
};

function ProductForm({ form }: Props) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-[54px]">
        {/* ── Product Information ── */}
        <section className="flex flex-col gap-6">
          <SectionHeader
            title="Product Information"
            description="Basic information to identify and organize this item."
          />

          <div className="flex flex-col gap-6">
            <CustomInputField
              nameValue="name"
              labelValue="Product Name"
              placeholder="e.g. Hair Saloon"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CustomInputField
                nameValue="sku"
                labelValue="SKU"
                placeholder="Product SKU code"
                required
              />
              <CustomInputField
                nameValue="barcode"
                labelValue="Barcode"
                placeholder="Barcode Number"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CustomSingleSelectField
                nameValue="category"
                labelValue="Product Category"
                placeholder="Select Category"
                categoryEndpoint={branchEndpoints.PRODUCT_CATEGORIES}
                LIMIT={8}
                required
              />
              <CustomInputField
                nameValue="brand"
                labelValue="Brand Name"
                placeholder="e.g. L'Oréal Paris"
                required
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* ── Pricing & Inventory ── */}
        <section className="flex flex-col gap-6">
          <SectionHeader
            title="Pricing & Inventory"
            description="Set pricing and keep track of stock levels."
          />

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CustomPriceField
                priceNameValue="selling_price"
                currencyNameValue="selling_price_currency"
                labelValue="Selling Price (NRs.)"
                placeholder="Enter Amount"
                required
              />
              <CustomPriceField
                priceNameValue="cost_price"
                currencyNameValue="cost_price_currency"
                labelValue="Cost Price (NRs.)"
                placeholder="Enter Amount"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <CustomInputField
                nameValue="stock_quantity"
                labelValue="Stock Quantity"
                placeholder="0"
                type="number"
                required
              />
              <CustomInputField
                nameValue="low_stock_threshold"
                labelValue="Min Stock Level"
                placeholder="0"
                type="number"
                required
              />
              <CustomSelectField
                nameValue="unit"
                labelValue="Unit"
                placeholder="Select unit"
                options={ProductUnitEnum.map((unit) => ({
                  label: unit.toUpperCase(),
                  value: unit,
                }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CustomSingleSelectField
                nameValue="batch"
                labelValue="Batch No."
                placeholder="Select Batch"
                categoryEndpoint={branchEndpoints.PRODUCT_BATCHES}
                LIMIT={8}
                required
              />
              <CustomDatePicker
                nameValue="expiry_date"
                labelValue="Expiry Date"
                placeholder="00/00/0000"
                fromDate={new Date()}
                required
              />
            </div>

            <Controller
              name="track_inventory"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2.5">
                    <Label className="text-sm font-medium leading-4 text-neutral-900">
                      Track inventory
                    </Label>
                    <p className="text-sm font-medium leading-4 text-neutral-500">
                      Enable this to track stock levels, batches, and expiration
                      dates for this product.
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>
        </section>

        <Separator />

        {/* ── Additional Information ── */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <SectionHeader
              title="Additional Information"
              description="Optional details for internal use or reference."
            />
          </div>

          <div className="flex flex-col gap-6">
            <CustomInputField
              nameValue="description"
              labelValue="Product Description"
              placeholder="Short description of the product"
              type="textarea"
              maxTextareaLimit={240}
            />

            <CustomInputField
              nameValue="note"
              labelValue="Notes"
              placeholder="Note here."
              type="textarea"
              maxTextareaLimit={240}
            />
          </div>
        </section>
      </div>
    </Form>
  );
}

export default ProductForm;

type SectionHeaderProps = {
  title: string;
  description: string;
};

function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-[20px] font-semibold leading-7 tracking-[-0.4px] text-neutral-900">
        {title}
      </h2>
      <p className="text-sm leading-4 text-neutral-600">{description}</p>
    </div>
  );
}
