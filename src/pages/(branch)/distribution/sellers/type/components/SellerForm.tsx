import CustomInputField from "@/components/form/CustomInputField";
import CustomSelectField from "@/components/form/CustomSelectField";
import { Form } from "@/components/ui/form";
import type useSellerFormActions from "../useSellerFormActions";

type Props = {
  form: ReturnType<typeof useSellerFormActions>["form"];
};

const tierOptions = [
  { label: "Tier 1", value: "tier_1" },
  { label: "Tier 2", value: "tier_2" },
  { label: "Tier 3", value: "tier_3" },
];

function SellerForm({ form }: Props) {
  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="name"
            labelValue="Seller Name"
            placeholder="Enter seller name"
            required
          />
          <CustomInputField
            nameValue="contact_person"
            labelValue="Contact Person"
            placeholder="Enter contact person"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="phone"
            labelValue="Phone"
            placeholder="Enter phone number"
            type="tel"
          />
          <CustomInputField
            nameValue="email"
            labelValue="Email"
            placeholder="Enter email address"
            type="email"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <CustomInputField
            nameValue="tax_id"
            labelValue="Tax ID"
            placeholder="Enter tax ID"
          />
          <CustomSelectField
            nameValue="tier"
            labelValue="Dealer Tier"
            placeholder="Select tier"
            options={tierOptions}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <CustomInputField
            nameValue="address"
            labelValue="Address"
            placeholder="Enter address"
            type="textarea"
          />
        </div>
      </div>
    </Form>
  );
}

export default SellerForm;
