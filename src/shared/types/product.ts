import { ProductCategoryApiType, ProductCategoryType } from "./category";

export type ProductApiType = {
  id: number,
  title: string,
  price: number,
  description: string,
  categoryId:	number,
  category: ProductCategoryApiType,
  images:	string[],
  slug: string,
  creationAt:	string,
  updatedAt: string,
};

export type ProductType = {
  id: number,
  title: string,
  price: number,
  description: string,
  categoryId:	number,
  category: ProductCategoryType,
  images:	string[],
  slug: string,
  creationAt:	Date,
  updatedAt: Date,
};
