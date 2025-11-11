import ProductsApi from '@api/ProductsApi';
import CategoriesApi from '@api/CategoriesApi';
import CartStore from '@store/global/CartStore';
import CategoriesStore from '@store/global/CategoriesStore';
import QueryParamsStore from '@store/global/QueryParams';
import { IClient } from '@api/types';
import AuthApi from '@api/AuthApi';
import AuthStore from '@store/global/AuthStore/AuthStore';
import ModalStore from '@store/global/ModalStore';
import { ReadonlyURLSearchParams } from 'next/navigation';
import PathStore from '@store/global/PathStore/PathStore';
import { reaction } from 'mobx';
import UserStore from '@store/global/UserStore/UserStore';

export type RootStoreInitData = {
  client: IClient;
  path: string;
  queryParams: URLSearchParams | ReadonlyURLSearchParams
}

export interface IRootStore {
  readonly pathStore: PathStore;
  readonly queryParamsStore: QueryParamsStore;
  readonly categoriesStore: CategoriesStore;
  readonly authStore: AuthStore;
  readonly userStore: UserStore;
  readonly cartStore: CartStore;
  readonly modalStore: ModalStore;
  readonly api: {
    categories: CategoriesApi
    products: ProductsApi,
    auth: AuthApi,
  }
};
export default class RootStore implements IRootStore {
  readonly pathStore: PathStore;
  readonly queryParamsStore: QueryParamsStore;
  readonly categoriesStore: CategoriesStore;
  readonly authStore: AuthStore;
  readonly userStore: UserStore;
  readonly cartStore: CartStore;
  readonly modalStore: ModalStore;
  readonly api: {
    categories: CategoriesApi,
    products: ProductsApi,
    auth: AuthApi,
  };

  constructor({
    client,
    path,
    queryParams
  }: RootStoreInitData) {
    
    this.api = {
      categories: new CategoriesApi(client),
      products: new ProductsApi(client),
      auth: new AuthApi(client),
    };
    this.pathStore = new PathStore(path);
    this.queryParamsStore = new QueryParamsStore(queryParams);
    this.categoriesStore = new CategoriesStore(this.api.categories);
    this.authStore = new AuthStore(this.api.auth);
    this.userStore = new UserStore(this.api.auth);
    this.cartStore = new CartStore();
    this.modalStore = new ModalStore();

    reaction(
      () => this.authStore.isAuthorized,
      (isAuthorized) => {
        if(isAuthorized) {
          this.userStore.fetchUser();
        } else {
          this.userStore.clearUser();
        }
      }
    );
  }
}
