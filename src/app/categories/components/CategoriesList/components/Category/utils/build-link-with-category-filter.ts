import { ProductCategoryType } from "@model/products";
import { appRoutes } from "@constants/app-routes";

const buildLinkWithCategoryFilter = (id: ProductCategoryType['id']): string => {
    return `${appRoutes.main.create()}?categories=${id}`;
}; 

export default buildLinkWithCategoryFilter;