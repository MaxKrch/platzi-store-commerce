import handleResponse from "@api/utils/handle-response";
import { ITransport, RequestOptions } from "../types";

export default class FetchClient implements ITransport {
    private headers: Record<string, string>;

    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    private handleFetchError(err: unknown): Promise<never> {
        if (err instanceof DOMException && err.name === 'AbortError') {
            return Promise.reject(err);
        }

        if (err instanceof TypeError && err.message === 'Failed to fetch') {
            return Promise.reject(new TypeError('Network error: сервер недоступен'));
        }

        return Promise.reject(err);
    }

    get = async <T = unknown>(url: string, options: RequestOptions): Promise<T> => {
        try {
            const { headers, signal, next } = options; 
            const response = await fetch(url, {
                headers: {...this.headers, ...headers},
                signal,
                next,
            });

            return await handleResponse(response);            
        } catch(err) {
            return this.handleFetchError(err);
        }
    };

    post = async <T = unknown, P  extends object = object>(url: string, body: P, options: RequestOptions): Promise<T> => {
        try {
            const { headers, signal, next } = options;
            const response = await fetch(url, {
                headers: {...this.headers, ...headers},
                method: 'POST',
                body: JSON.stringify(body),
                signal,
                next,
            });

            return await handleResponse(response);            
        } catch(err) {
            return this.handleFetchError(err);
        }
    };
} 