import { ProductApiType, ProductType } from "@model/products";


const normalizeProductItem = (from: ProductApiType): ProductType => ({
  id: from.id,
  documentId: from.documentId,
  title: from.title,
  description: from.description,
  price: from.price,
  discountPercent: from.discountPercent,
  rating: from.rating,
  isInStock: from.isInStock,
  images: from.images,
  createdAt: new Date(from.createdAt),
  updatedAt: new Date(from.updatedAt),
  publishedAt: new Date(from.publishedAt),
  productCategory: from.productCategory,
});

const normalizeProductList = (from: ProductApiType[]): ProductType[] => {
  return from.map((product) => normalizeProductItem(product));
};

export { normalizeProductItem, normalizeProductList };
