import { appRoutes } from "@constants/app-routes";
import { ProductCategoryType } from "@model/category";

const buildLinkWithCategoryFilter = (id: ProductCategoryType['id']): string => {
    return `${appRoutes.main.create()}?category=${id}`;
}; 

export default buildLinkWithCategoryFilter;