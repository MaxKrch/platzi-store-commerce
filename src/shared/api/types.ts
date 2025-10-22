import { InternalAxiosRequestConfig } from "axios";

export type RequestOptions = {
    requiredAuth?: boolean;
    headers?: Record<string, string>;
    signal?: AbortSignal,
    next?: { 
        revalidate?: number; 
        tags?: string[]; 
        cache?: 'default' | 'no-store' 
    };
}

export type AuthRequestConfig = {
  requiredAuth?: boolean;
} & InternalAxiosRequestConfig;

export interface IClient {
  get<T = unknown>(url: string, options?: RequestOptions): Promise<T>;
  post<T = unknown, P extends object = object>(url: string, data: P, options?: RequestOptions): Promise<T>;
}

