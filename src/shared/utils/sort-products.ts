import { DEFAULT_SORT, SortKeys } from "@constants/product-sort";
import { ProductType } from "@model/product";

const sortProducts = (products: ProductType[], sort: SortKeys = DEFAULT_SORT) => {
    const cloned = [...products];
    switch(sort) {
        case 'newest':
            return cloned.sort((a, b) => new Date(b.creationAt).getTime() - new Date(a.creationAt).getTime());

        case 'price_asc':
            return cloned.sort((a, b) => a.price - b.price);

        case 'price_desc':
            return cloned.sort((a, b) => b.price - a.price);
            
        default:
            return products;
    }
};

export default sortProducts;