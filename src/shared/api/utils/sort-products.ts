import { DEFAULT_SORT, SortKeys } from "@constants/product-sort";
import { ProductApiType } from "@model/products";

const sortProducts = (products: ProductApiType[], sort: SortKeys = DEFAULT_SORT) => {
    const cloned = [...products];
    switch(sort) {
        case 'newest':
            return cloned.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

        case 'discount':
            return cloned.sort((a, b) => b.discountPercent - a.discountPercent);

        case 'popular':
            return cloned.sort((a, b) => b.rating - a.rating);

        case 'price_asc':
            return cloned.sort((a, b) => a.price - b.price);

        case 'price_desc':
            return cloned.sort((a, b) => b.price - a.price);
            
        default:
            return products;
    }
};

export default sortProducts;