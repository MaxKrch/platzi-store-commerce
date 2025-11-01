import { ProductApiType, ProductType } from "@model/product";


const normalizeProductItem = (from: ProductApiType): ProductType => ({
  id: from.id,
  title: from.title,
  price: from.price,
  description: from.description,
  categoryId: from.categoryId,
  category: from.category,
  images: from.images,
  slug: from.slug,
  creationAt:	new Date(from.creationAt),
  updatedAt: new Date(from.updatedAt),
});

const normalizeProductList = (from: ProductApiType[]): ProductType[] => {
  return from.map((product) => normalizeProductItem(product));
};

export { normalizeProductItem, normalizeProductList };
