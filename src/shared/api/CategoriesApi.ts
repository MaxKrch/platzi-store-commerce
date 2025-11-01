import { ProductCategoryApiType } from "@model/category";
import { IClient, RequestOptions } from "./types";
import formateError from "./utils/formate-error";

export default class CategoriesApi {
    private _client: IClient;
    private _baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    constructor(client: IClient) {
        this._client = client;
    }

    getCategories = async ({ signal, next }: RequestOptions) => {
        try {
            const response = await this._client.get<ProductCategoryApiType[]>(
                this._createGetCategoriesURL(),
                { signal, next }
            );

            return response;

        } catch (err) {
            throw formateError(err);
        }
    };
    
    private _createGetCategoriesURL = (): string => {
        return `${this._baseUrl}/categories`;
    };
}