import { ProductInCartApi } from "@model/cart";
import { isStrapiSuccessResponseCart, StrapiResponseCart } from "@model/strapi-api";
import { IClient } from "./types";
import formateError from "./utils/formate-error";
import { ProductType } from "../types/products";

export type ProductChangeParams = {
    product: ProductType['id'],
    quantity?: number,
}

export default class CartApi {
    private client: IClient;
    private path = {
        list: '/cart',
        add: '/cart/add',
        remove: '/cart/remove',
    };

    constructor(client: IClient) {
        this.client = client;
    }

    getCart = async (signal?: AbortSignal) => {
        try {
            const response = await this.client.get<StrapiResponseCart<ProductInCartApi[]>>(
                this.path.list,
                { signal, requiredAuth: true, }
            );
        
            if (!isStrapiSuccessResponseCart<ProductInCartApi[]>(response)) {
                throw new Error(response.error.message);
            }
            return response;
        } catch (err) {
            throw formateError(err);
        }
    };

    addProduct = async ({ product, quantity = 1 }: ProductChangeParams, signal?: AbortSignal) => {
        try {
            const response = await this.client.post<StrapiResponseCart<ProductInCartApi>>(
                this.path.add,
                { product, quantity },
                { signal, requiredAuth: true },
            );

            if (!isStrapiSuccessResponseCart<ProductInCartApi>(response)) {
                throw new Error(response.error.message);
            }

            return response;
        } catch (err) {
            throw formateError(err);
        }
    };
    
    removeProduct = async ({ product, quantity = 1 }: ProductChangeParams, signal?: AbortSignal) => {
        try {
            const response = await this.client.post<StrapiResponseCart<ProductInCartApi>>(
                this.path.remove,
                { product, quantity },
                { signal, requiredAuth: true }
            );

            if (!isStrapiSuccessResponseCart<ProductInCartApi>(response)) {
                throw new Error(response.error.message);
            }

            return response;
        } catch (err) {
            throw formateError(err);
        }
    };
}


