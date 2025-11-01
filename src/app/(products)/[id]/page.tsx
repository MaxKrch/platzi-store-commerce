import Client from "@api/client";
import ProductsApi from "@api/ProductsApi";
import { ProductDetailsInitData } from "@store/local/ProductDetailsStore/ProductDetailsStore";
import { ProductsInitData } from "@store/local/ProductsStore/ProductsStore";
import { notFound } from "next/navigation";
import { ProductDetailsStoreProvider } from "@providers/ProductDetailsStoreProvider";
import { ProductsStoreProvider } from "@providers/ProductsStoreProvider";
import StepBack from "./components/StepBack";
import ProductCard from "./components/ProductCard";
import RelatedProducts from "./components/RelatedProducts";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const productApi = new ProductsApi(new Client());
    const { id } = await params;
    try {
        const response = await productApi.getProductDetails(Number(id), {next: { revalidate: 60 }});

        return {
            title: response.title,
            description: response.description,
         };

    } catch {
        return {
            title: "Страница товара"
        };
    }
}

type ProductDetailsPageProps = {
    params: Promise<{id: string}>
}

export default async function ProductDetailsPage ({params}: ProductDetailsPageProps) {
    let productDetailsInitData: ProductDetailsInitData;
    let productsInitData: ProductsInitData; 
    const { id } = await params;
    const productsApi = new ProductsApi(new Client);

    try {
        const [productDetailsRes, productsRes] = await Promise.all([
            productsApi.getProductDetails(Number(id), {next: { revalidate: 120 }}),
            productsApi.getRelatedProducts(Number(id), {next: { revalidate: 120 }})
        ]);

        productDetailsInitData = {
            success: true,
            product: productDetailsRes,
            id: id,                       
        };
        
        productsInitData = {
            success: true,
            products: productsRes,
            query: id,
        };

    } catch(err) {
        if(err instanceof Error && err.message === 'Not Found') {
            notFound();
        }

        productDetailsInitData = {
            success: false,
            id: id,
            error: err instanceof Error ? err.message : "UnknownError"
        };

        productsInitData = {
            success: false,
            query: id,
            error: err instanceof Error ? err.message : "UnknownError"
        };
    }

    return (
        <div>
             <ProductDetailsStoreProvider initData={productDetailsInitData}>
                <ProductsStoreProvider initData={productsInitData}>
                    <StepBack />
                    <ProductCard />
                    <RelatedProducts />
                 </ProductsStoreProvider>
            </ProductDetailsStoreProvider>
        </div>
    );
};

