import type { User } from "@/types/user";

export interface Category {
  id: number;
  name: string;
  created_by: User;
  updated_by: User | null;
}

export interface Service {
  id: number;
  name: string;
  category: Category;
  category_id: number;
  price: string;
  duration: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: User;
  updated_by: User | null;
}

export interface ServiceCategory {
  id: number;
  name: string;
}
