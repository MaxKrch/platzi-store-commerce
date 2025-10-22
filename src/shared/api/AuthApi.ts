import { AuthData, RegisterData } from "@model/auth";
import { IClient } from "./types";
import formateError from "./utils/formate-error";
import { isStrapiSuccessResponseAuth, StrapiResponseAuth, StrapiSuccessResponseAuth } from "@model/strapi-api";

export default class AuthApi {
    private client: IClient; 
    private path = {
        login: "auth/local",
        register: "auth/local/register",    
    };

    constructor(client: IClient) {
        this.client = client; 
    }

    register = async (data: RegisterData, signal?: AbortSignal): Promise<StrapiSuccessResponseAuth> => {
        try {
            const response = await this.client.post<StrapiResponseAuth>(this.path.register, data, { signal });
            
            if(!isStrapiSuccessResponseAuth(response)) {
                throw response;
            }

            return response;
        } catch(err) {
            throw formateError(err);
        }
    };
    
    login = async (data: AuthData, signal?: AbortSignal): Promise<StrapiSuccessResponseAuth> => {
        try {
            const response = await this.client.post<StrapiResponseAuth>(this.path.login, data, { signal });
            
            if(!isStrapiSuccessResponseAuth(response)) {
                throw response;
            }

            return response;
        } catch(err) {
            throw formateError(err);
        }
    };
}
