import { QueryParams } from "@model/query-params";
import { ProductsStoreProvider } from "../providers/ProductsStoreProvider";
import ProductsApi from "@api/ProductsApi";
import Client from "@api/client";

import { isStrapiSuccessResponseProducts } from "@model/strapi-api";
import { ProductsInitData } from "@store/local/ProductsStore/ProductsStore";
import SectionHeader from "@components/SectionHeader";
import ProductList from "./components/ProductList";
import qs from "qs";
import ProductPagination from "./components/ProductPagination";
import ProductSearch from "./components/ProductSearch";
import { Metadata } from "next";

export const sectionText = {
  title: "Товары",
  description: [
    'Мы собрали для вас самые горячие новинки сезона и хиты продаж',
    'Если ищите что-то конкретное - просто начните вводить название'
  ]
};   

export const metadata: Metadata = {
  title: "Каталок товаров",
  description: "Горячие новинки сезона и хиты продаж - тысячи товаров специально для вас",
};

type ProductsPageProps = {
    searchParams: Promise<QueryParams>
}

export default async function ProductsPage ({searchParams}: ProductsPageProps) {
    let initData: ProductsInitData; 

    const params = await searchParams;
    const categories = params.categories;
    if(categories && !Array.isArray(categories)) {
        params.categories = [categories];
    }
    const productsApi = new ProductsApi(new Client);
    const queryString = qs.stringify(params, { arrayFormat: 'repeat' });

    try {
        const response = await productsApi.getProductList(params, { next: { cache: "no-store" }});
        
        if(!isStrapiSuccessResponseProducts(response)) {
            throw response;
        }

        initData = {
            success: true,
            query: queryString,
            products: response.data,
            meta: response.meta,            
        };

    } catch(err) {
        initData = {
            success: false,
            query: queryString,
            error: err instanceof Error ? err.message : "UnknownError"
        };
    }

    return (
        <div>
            <ProductsStoreProvider initData={initData}>
                <SectionHeader title={sectionText.title} content={sectionText.description} />
                <ProductSearch />
                <ProductList />
                <ProductPagination />
            </ProductsStoreProvider>
        </div>
    );
};

