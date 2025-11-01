import { AuthData, AuthResponse, CheckAvailableEmailData, CheckAvailableEmailResponse, LogoutResponse, RefreshTokensData, RegisterUserData, RegisterUserResponse } from "@model/platzi-api";
import { IClient } from "./types";
import formateError from "./utils/formate-error";
import { UserApi } from "@model/user";

export default class AuthApi {
    _client: IClient; 
    private _baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    private _authUrl = '/api/auth';

    constructor(client: IClient) {
        this._client = client; 
    }

    checkEmail = async (email: CheckAvailableEmailData, signal?: AbortSignal): Promise<CheckAvailableEmailResponse> => {
        try {
            const response = await this._client.post<CheckAvailableEmailResponse>(
                this._createCheckEmailURL(), 
                { email }, 
                { signal }
            );

            return response;
        } catch(err) {
            throw formateError(err);
        }
    };

    register = async (data: RegisterUserData, signal?: AbortSignal): Promise<RegisterUserResponse> => {
        try {
            const response = await this._client.post<RegisterUserResponse>(
                this._createRegisterURL(), 
                data, 
                { signal });
            
            return response;
        } catch(err) {
            throw formateError(err);
        }
    };
    
    login = async (data: AuthData, signal?: AbortSignal): Promise<AuthResponse> => {
        try {
            const response = await this._client.post<AuthResponse>(
                this._createLoginURL(),
                data,
                { signal }
            );

            return response;
        } catch(err) {
            throw formateError(err);
        }
    };

    logout = async (signal?: AbortSignal): Promise<LogoutResponse> => {
        try {
            const response = await this._client.get<LogoutResponse>(
                this._createLogoutURL(),
                { signal }
            );

            return response;
        } catch(err) {
            throw formateError(err);
        }
    };

    getProfile = async (signal?: AbortSignal) => {
        try {

            const response = await this._client.get<UserApi>(
                this._createGetProfileURL(),
                { signal, requiredAuth: true }
            );
            return response;
        } catch(err) {
            throw formateError(err);
        }
    };

    refreshTokens = async (data: RefreshTokensData, signal?: AbortSignal) => {
         try {
            const response = await this._client.post<AuthResponse>(
                this._createRefreshTokens(),
                data,
                { signal, requiredAuth: true }
            );

            return response;
        } catch(err) {
            throw formateError(err);
        }

    };

    private _createCheckEmailURL = (): string => {
        return `${this._baseUrl}/users/is-available`;
    };

    private _createGetProfileURL = (): string => {
        return `${this._baseUrl}/auth/profile`;
    };

    private _createRegisterURL = (): string => {
        return `${this._baseUrl}/users/`;
    };
    
    private _createLoginURL = (): string => {
        return `${this._authUrl}/login`;
    };

    private _createLogoutURL = (): string => {
        return `${this._authUrl}/logout`;
    };

    private _createRefreshTokens = (): string => {
        return `${this._authUrl}/refresh`;
    };
}
