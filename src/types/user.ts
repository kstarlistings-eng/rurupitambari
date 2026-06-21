interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active?: boolean;
}

interface Admin {
  name: string;
  email: string;
}
interface Organization {
  id: string;
  name: string;
  slug: string;
  admin: Admin;
  status: "Active" | "Inactive" | "Suspended" | "Trial";
  trialDays: number | string | null;
  planType: string;
  maxBranches: number;
  maxEmployees: number;
  maxWebhooks: number;
}

export type { User, Organization };
