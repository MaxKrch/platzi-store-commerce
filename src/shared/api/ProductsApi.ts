import { ProductApiType, ProductType } from "@model/product";
import { QueryParams } from "@model/query-params";
import { IClient, RequestOptions } from "./types";
import { buildQueryString } from "./utils/build-query-string";
import formateError from "./utils/formate-error";

export default class ProductsApi {
    private _client: IClient;
    private _baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
     
    constructor(client: IClient) {
        this._client = client;
    }
    
    getProductList = async (params: QueryParams, { signal, next }: RequestOptions) => {
        try {
            const response = await this._client.get<ProductApiType[]>(
                this._createGetProductListURL(params),
                { signal, next }
            );

            return response;
        } catch (err) {
            throw formateError(err);
        }
    };

    getProductDetails = async (id: ProductType['id'], { signal, next }: RequestOptions) => {
        try {
            const response = await this._client.get<ProductApiType>(
                this._createGetProductDetailsURL(id),
                { signal, next }
            );

            return response;
        } catch (err) {
            throw formateError(err);
        }
    };

    getRelatedProducts = async (id: ProductType['id'], { signal, next }: RequestOptions) => {
        try {
            const response = await this._client.get<ProductApiType[]>(
                this._createGetRelatedProductsURL(id),
                { signal, next }
            );

            return response;
        } catch (err) {
            throw formateError(err);
        }
    };

    private _createGetProductListURL = (query: QueryParams): string => {
        const queryString = buildQueryString(query);

        return `${this._baseUrl}/products?${queryString}`;
    };

    private _createGetProductDetailsURL = (id: ProductType['id'] ): string => {
        return `${this._baseUrl}/products/${id}`;
    };

    private _createGetRelatedProductsURL = (id: ProductType['id']): string => {
        const queryString = buildQueryString({ limit: 12 });
        return `${this._baseUrl}/products/${id}/related?${queryString}`;
    };
}