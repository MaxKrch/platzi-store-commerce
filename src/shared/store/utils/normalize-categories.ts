import { ProductCategoryApiType, ProductCategoryType } from "@model/category";


const normalizeCategoriesItem = (from: ProductCategoryApiType): ProductCategoryType => ({
  id: from.id,
  name:	from.name,
  image: from.image,
  slug:	from.slug
});

const normalizeCategoriesList = (from: ProductCategoryApiType[]): ProductCategoryType[] => {
  return from.map((product) => normalizeCategoriesItem(product));
};

export { normalizeCategoriesItem, normalizeCategoriesList };
