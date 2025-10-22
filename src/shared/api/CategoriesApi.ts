import { ProductCategoryApiType } from "@model/products";
import { isStrapiSuccessResponseProducts, StrapiResponseProducts } from "@model/strapi-api";
import { IClient, RequestOptions } from "./types";
import formateError from "./utils/formate-error";
import { buildQueryString } from "./utils/build-query-string";

export default class CategoriesApi {
    private client: IClient;
    private populate = ['image'];

    constructor(client: IClient) {
        this.client = client;
    }

    private _createGetCategoriesURL = (): string => {
        const queryString = buildQueryString({
            populate: this.populate,
          }, 'categories');
    
          return `/product-categories?${queryString}`;
        };

    getCategories = async ({ signal, next }: RequestOptions) => {
        try {
            const response = await this.client.get<StrapiResponseProducts<ProductCategoryApiType[]>>(
                this._createGetCategoriesURL(),
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