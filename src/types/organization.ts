export type StatusEnum = "Trial" | "Active" | "Suspended";

export interface Limit {
  type: "limited" | "unlimited";
  action: "max_branches" | "max_employees" | "max_webhooks";
  limits: number | null;
  tag: string;
}

export type LimitType = 'limited' | 'unlimited';

export interface PlanLimit {
  type: LimitType;
  action: string; 
  limits: number;
  tag: string;
}

export interface PlanType {
  id: number;
  name: string;
  limits: PlanLimit[];
  created_by: string | null;
  updated_by: string | null;
}

export interface AdminDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  status: StatusEnum;
  trial_days: number;
  plan_type: PlanType;
  organization_logo: string;
  send_mail_notifications: boolean;
  trial_end_date: string;
  total_user_count:number;
  organization_logo_url: string;
  admin_details: AdminDetails;
  created_at: string;
  created_by: number | null;
  updated_by: number | null;
}

export interface OrganizationUser {
  id: number;
  last_login: string;
  status: "is_active" | "is_inactive";
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_by: number | null;
  updated_by: number | null;
}
