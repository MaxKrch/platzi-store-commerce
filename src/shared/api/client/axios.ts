import axios, { AxiosInstance, isCancel, type AxiosResponse } from 'axios';
import { ITransport, RequestOptions } from '../types';
import { ApiError } from '@api/utils/handle-response';

export default class AxiosClient implements ITransport {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error) => {
        if (isCancel(error)) {
          return Promise.reject(new DOMException('Request aborted', 'AbortError'));
        }

        if (error.response) {
          const apiError: ApiError = {
            status: error.response.status,
            message: error.response.data?.error?.message ?? error.response.statusText,
            details: error.response.data ?? null,
          };
          return Promise.reject(apiError);
        }

        if (error.request) {
          return Promise.reject(new TypeError('Network error: сервер недоступен'));
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

  put = async <T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<T> => {
    const { next: _next, ...clearedOptions } = options ?? {};
    void _next;
    return this.instance.put(url, data, clearedOptions);
  };
};