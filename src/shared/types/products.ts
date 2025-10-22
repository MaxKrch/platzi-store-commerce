type ImageType = {
  id: number;
  documentId: string;
  url: string;
  name?: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
};

export type ProductCategoryApiType = {
  id: number;
  documentId: string;
  title: string;
  image: ImageType;
};

export type ProductCategoryType = {
  id: number;
  documentId: string;
  title: string;
  image: ImageType;
};

export type ProductApiType = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  discountPercent: number;
  rating: number;
  isInStock: boolean;
  images: ImageType[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  productCategory: ProductCategoryType;
};

export type ProductType = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  price: number;
  discountPercent: number;
  rating: number;
  isInStock: boolean;
  images: ImageType[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  productCategory: ProductCategoryType;
};
