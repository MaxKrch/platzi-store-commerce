import { ITransport, RequestOptions } from "@api/types";
import AxiosClient from "./axios";
import FetchClient from "./fetch";
import TokenStorage from "@services/TokenStorage";
import { isApiError } from '@api/utils/handle-response';
import { AuthResponse } from "@model/platzi-api";
import UserStorage from "@services/UserStorage";

const REFRESH_API = '/api/auth/refresh';

const Client = typeof window === 'undefined'
    ? FetchClient
    : AxiosClient;

type RequestInit = 
  | { url: string; method: 'GET'; options?: RequestOptions; }
  | { url: string; method: 'POST'; options?: RequestOptions; data: object; } 

type QueuedRequest<T> = RequestInit & {
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

export default class ApiClient {
    private client: ITransport;
    private requestQueue: QueuedRequest<unknown>[] = [];
    private _isRefreshing = false;
    private _refreshFailed = false;

    constructor() {
        this.client = new Client();
    }

    get = async <T = unknown>(url: string, options?: RequestOptions): Promise<T> => {
        return this.initRequest<T>({ method: 'GET', url, options });
    };

    post = async <T = unknown, P extends object = object>(url: string, data: P, options?: RequestOptions): Promise<T> => {
        return this.initRequest<T>({ method: 'POST', url, data, options });
    };

    resetRefreshFailed(): void {
        this._refreshFailed = false;
    }

    private initRequest = async <T = unknown>(args: RequestInit) => {
        if(!args.options?.requiredAuth) {
            return this.request<T>(args);
        } 

        if(this._refreshFailed) {
            return Promise.reject(new Error('Token Refresh Failed'));
        }

        if(this._isRefreshing) {
            return this.addToQueue<T>(args);
        }

        args.options.headers = {
            ...args.options.headers,
            Authorization: `Bearer ${this.accessToken}`
        };
      
        try {
            const response = await this.request<T>(args);
            this.resolveQueue();

            return response;
        } catch(error) {
            if(isApiError(error) && error.status === 401) {
                if(!this._isRefreshing) {
                    this._isRefreshing = true;
                    this.refreshTokens();

                    return this.addToQueue<T>(args);
                }
            }

            throw error;
        }

    };

    private request = async <T = unknown>(args: RequestInit) => {
        const { url, method, options } = args;

        switch(method) {
            case 'GET': 
                return this.client.get<T>(url, options);

            case 'POST':
                return this.client.post<T>(url, args.data, options);
 
        }
    };
    
    private get accessToken(): string | null {
        return TokenStorage.token;
    }

    private addToQueue<T>(args: RequestInit): Promise<T> {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ ...args, resolve, reject } as QueuedRequest<unknown>);
        });
    }

    private async refreshTokens(): Promise<void> {
        try {
            const response = await this.post<AuthResponse>(REFRESH_API, {
                keepMeLoggedIn: UserStorage.shouldKeepLogged
            });

            if(!response.success) {
                throw new Error(response.error);
            }

            TokenStorage.token = response.token;
            this._isRefreshing = false;
            this._refreshFailed = false;

            this.resolveQueue();

        } catch {
            this._refreshFailed = true;
            this._isRefreshing = false;
            this.rejectQueue();
        } 
    }

    private resolveQueue(): void {
        const queue = [...this.requestQueue];
        this.requestQueue = [];

        queue.forEach((request) => {
            return this.repeatRequest(request);
        });
    }

    private rejectQueue(): void {
        const queue = [...this.requestQueue];
        this.requestQueue = [];

        queue.forEach((request) => {
            request.reject(new Error('Refresh Token Failed'));
        });
    }

    private async repeatRequest<T>(request: QueuedRequest<T>): Promise<void> {
        try {
            let response: T;

            if(request.method === 'GET') {
                response = await this.client.get(request.url, {
                    ...request.options,
                    headers: {
                        ...request.options?.headers,
                        Authorization: `Bearer ${this.accessToken}`
                    }
                });
            } else {
                response = await this.client.post(request.url, request.data, {
                    ...request.options,
                    headers: {
                        ...request.options?.headers,
                        Authorization: `Bearer ${this.accessToken}`
                    }
                });
            }

            request.resolve(response);

        } catch(err) {
            request.reject(err);
        }
    } 
};
