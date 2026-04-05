import type { CreatedBy } from "./customer";

export interface Appointment {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  is_active: boolean;
  date: string;
  time: string;
  email: string;
  services_summary: ServiceSummary[];
  primary_staff: PrimaryStaff;
  staff_name?: string;
  status: string;
  service?: string;
  customer: Customer;
  created_by: CreatedBy;
  updated_by: CreatedBy | null;
}

type Customer = {
  created_by: CreatedBy;
  email:string;
  full_name: string
  id: number;
  phone_number: string;
}

type ServiceSummary = {
  id: number;
  name: string;
  price: number;
}

type PrimaryStaff = {
  id: number;
  full_name: string;
  specialization: string;
  created_by: CreatedBy | null;
  updated_by: CreatedBy | null;
}