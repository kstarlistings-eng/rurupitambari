import type { CreatedBy } from "./customer";

export interface Staff {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_country_code: string;
  phone: string;
  email: string;
  is_active: boolean;
  specialization: string;
  joined_date:string;
  created_by: CreatedBy;
  updated_by: CreatedBy | null;
}