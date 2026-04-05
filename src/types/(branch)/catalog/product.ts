export interface Product {
  id: number;
  sku: string;
  barcode: string;
  name: string;
  brand: string;
  category: number;
  batch: number;
  category_detail: ProductCategory;
  batch_detail: ProductBatch;
  selling_price: string;
  cost_price: string;
  expiry_date: string;
  stock_quantity: number;
  low_stock_threshold: number;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  stock_status_display: string;
  is_active: boolean;
  status: "active" | "inactive";
  status_display: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

export interface ProductBatch {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}
