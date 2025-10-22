import { IClient, RequestOptions } from "../types";

export default class FetchClient implements IClient {
    private baseURL?: string;
    private headers: Record<string, string>;

    constructor(baseURL?: string) {
        this.baseURL = baseURL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    private rejectError(err: unknown): Promise<never> {
        if (err instanceof DOMException && err.name === 'AbortError') {
            return Promise.reject(new DOMException('Request aborted', 'AbortError'));
        }
        
        if (err instanceof Error) {
            return Promise.reject(err);
        }
        
        return Promise.reject(new Error("UnknownError"));
    }

    private createFullUrl = (url: string): string => {
        return `${this.baseURL}${url}`;
    };

    get = async <T = unknown>(url: string, options: RequestOptions): Promise<T> => {
        try {
            const { headers, signal, next } = options;
            const response = await fetch(this.createFullUrl(url), {
                headers: {...this.headers, ...headers},
                signal,
                next,
            });

            if(!response.ok) {
                throw new Error(response.statusText);
            }
            const data = response.json() as T;
            return data ;
        } catch(err) {
            return this.rejectError(err);
        }
    };

    post = async <T = unknown, P  extends object = object>(url: string, body: P, options: RequestOptions): Promise<T> => {
        try {
            const { headers, signal, next } = options;
            const response = await fetch(this.createFullUrl(url), {
                headers: {...this.headers, ...headers},
                body: JSON.stringify(body),
                signal,
                next,
            });

            if(!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json() as T;
            return data;
        } catch(err) {
            return this.rejectError(err);
        }
    };
} 