import axios, { AxiosInstance, isCancel, type AxiosResponse } from 'axios';
import { AuthRequestConfig, RequestOptions } from '../types';
import UserStorage from 'src/shared/services/UserStorage';

export default class AxiosClient {
  private instance: AxiosInstance;

  constructor(baseURL?: string) {
    this.instance = axios.create({
      baseURL: baseURL ?? process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    this.instance.interceptors.request.use((config: AuthRequestConfig) => {
      if (config.requiredAuth) {
        const token = UserStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error) => {
        if (isCancel(error)) {
          return Promise.reject(new DOMException('Request aborted', 'AbortError'));
        }

        if (error?.response) {
          return Promise.reject(new Error(error.response.data.error.message ?? 'ServerError'));
        }

        if (error.request) {
          return Promise.reject(new Error('NetworkError'));
        }

        return Promise.reject(new Error('UnknownError'));
      }
    );
  }

  get = async <T = unknown>(url: string, options?: RequestOptions): Promise<T> => {
    const { next: _next, ...clearedOptions } = options ?? {};
    void _next;
    return this.instance.get(url, clearedOptions);
  };
  post = async <T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    const { next: _next, ...clearedOptions } = options ?? {};
    void _next;
    return this.instance.post(url, data, clearedOptions);
  };
};

