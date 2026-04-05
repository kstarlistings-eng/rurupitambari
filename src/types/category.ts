export interface Category {
  id: number;
  order: number;
  name: string;
  color: string;
  published_count?: number;
};

export type AddCategoryData = {
  name: string;
  color: string;
};

export type UpdateCategoryData = {
  id: number;
  name: string;
  color: string;
};
