export type StatusEnum = "active" | "inactive" | "suspended";

export interface BranchResponse {
  success: boolean;
  data: Branch;
}

export interface Branch {
  id: number;
  name: string;
  slug: string;
  address: string;
  status: StatusEnum;
  is_active: boolean;
  staff_count: number;
  phone?: string;
  email?: string;
  admin: User | null;
  created_at: string;
  created_by: User | null;
  updated_by: User | null;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string | null;
}
