import { ProductCategoryApiType, ProductCategoryType } from "@model/products";

const normalizeCategoriesItem = (from: ProductCategoryApiType): ProductCategoryType => ({
  id: from.id,
  documentId: from.documentId,
  title: from.title,
  image: from.image,
});

const normalizeCategoriesList = (from: ProductCategoryApiType[]): ProductCategoryType[] => {
  return from.map((product) => normalizeCategoriesItem(product));
};

export { normalizeCategoriesItem, normalizeCategoriesList };
