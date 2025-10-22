import { ProductApiType, ProductType } from "@model/products";
import { QueryParams } from "@model/query-params";
import { isStrapiSuccessResponseProducts, StrapiResponseProducts } from "@model/strapi-api";
import { IClient, RequestOptions } from "./types";
import { buildQueryString } from "./utils/build-query-string";
import formateError from "./utils/formate-error";
import sortProducts from "./utils/sort-products";

export default class ProductsApi {
    private client: IClient;
    private populate = ['images', 'productCategory'];
     
    constructor(client: IClient) {
        this.client = client;
    }

    private createGetProductListURL = (query: QueryParams): string => {
        const queryString = buildQueryString({
        ...query,
        populate: this.populate,
      });

      return `/products?${queryString}`;
    };

    private createGetProductDetailsURL = (id: string ): string => {
      const queryString = buildQueryString({ populate: this.populate });

      return `/products/${id}?${queryString}`;
    };
    
    getProductList = async (params: QueryParams, { signal, next }: RequestOptions) => {
        try {
            const response = await this.client.get<StrapiResponseProducts<ProductApiType[]>>(
                this.createGetProductListURL(params),
                { signal, next }
            );

            if (!isStrapiSuccessResponseProducts(response)) {
                throw new Error(response.error.message);
            }
            response.data = sortProducts(response.data, params.sort);
            return response;
        } catch (err) {
            throw formateError(err);
        }
    };

    getProductDetails = async (id: ProductType['documentId'], { signal, next }: RequestOptions) => {
        try {
            const response = await this.client.get<StrapiResponseProducts<ProductApiType>>(
                this.createGetProductDetailsURL(id),
                { signal, next }
            );

            if (!isStrapiSuccessResponseProducts(response)) {
                throw new Error(response.error.message);
            }

            return response;
        } catch (err) {
            throw formateError(err);
        }
    };
}