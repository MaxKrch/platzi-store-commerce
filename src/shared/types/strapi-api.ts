import { UserApi } from './auth';
import type { ProductInCartApi } from './cart';

export type StrapiPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type MetaResponse<T> = T extends unknown[] ? { pagination: StrapiPagination } : object;

type StrapiResponseError = {
  data: object;
  meta: never;
  error: {
    status: number;
    name: string;
    message: string;
  };
};

type StrapiResponseSuccessProducts<T> = {
  data: T;
  meta: MetaResponse<T>;
  error: never;
};

export type StrapiResponseProducts<T> = StrapiResponseSuccessProducts<T> | StrapiResponseError;

export function isStrapiSuccessResponseProducts<T>(response: StrapiResponseProducts<T>): response is StrapiResponseSuccessProducts<T> {
  return !('error' in response);
}


export type StrapiResponseCart<T extends ProductInCartApi | ProductInCartApi[]> = T | StrapiResponseError;

export function isStrapiSuccessResponseCart<T extends ProductInCartApi | ProductInCartApi[]>(
  response: StrapiResponseCart<T>
): response is T {
  return !('error' in response);
}

export type StrapiSuccessResponseAuth = {
    jwt: string,
    user: UserApi, 
}

export type StrapiResponseAuth = StrapiSuccessResponseAuth | StrapiResponseError

export function isStrapiSuccessResponseAuth (response: StrapiResponseAuth): response is StrapiSuccessResponseAuth {
  return !('error' in response);
}
