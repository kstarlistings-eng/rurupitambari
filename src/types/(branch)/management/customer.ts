export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  email: string;
  is_active: boolean;
  total_visits: number;
  total_spent: number;
  created_by: CreatedBy;
  updated_by: CreatedBy | null;
}

export interface CreatedBy {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
}
