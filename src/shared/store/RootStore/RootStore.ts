import ProductsApi from '@api/ProductsApi';
import CartApi from '@api/CartApi';
import CategoriesApi from '@api/CategoriesApi';
import CartStore from '@store/global/CartStore';
import CategoriesStore from '@store/global/CategoriesStore';
import QueryParamsStore from '@store/global/QueryParams';
import { IClient } from '@api/types';
import AuthApi from '@api/AuthApi';
import UserStore from '@store/global/UserStore/UserStore';
import ModalStore from '@store/global/ModalStore';
import { reaction } from 'mobx';
import { ReadonlyURLSearchParams } from 'next/navigation';
import PathStore from '@store/global/PathStore/PathStore';

export type RootStoreInitData = {
  client: IClient;
  path: string;
  queryParams: URLSearchParams | ReadonlyURLSearchParams
}

export interface IRootStore {
  readonly pathStore: PathStore;
  readonly queryParamsStore: QueryParamsStore;
  readonly categoriesStore: CategoriesStore;
  readonly userStore: UserStore;
  readonly cartStore: CartStore;
  readonly modalStore: ModalStore;
  readonly api: {
    categories: CategoriesApi
    products: ProductsApi,
    auth: AuthApi,
    cart: CartApi,
  }
};
export default class RootStore implements IRootStore {
  readonly pathStore: PathStore;
  readonly queryParamsStore: QueryParamsStore;
  readonly categoriesStore: CategoriesStore;
  readonly userStore: UserStore;
  readonly cartStore: CartStore;
  readonly modalStore: ModalStore;
  readonly api: {
    categories: CategoriesApi,
    products: ProductsApi,
    auth: AuthApi,
    cart: CartApi,
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
      cart: new CartApi(client),
    };
    this.pathStore = new PathStore(path);
    this.queryParamsStore = new QueryParamsStore(queryParams);
    this.categoriesStore = new CategoriesStore(this.api.categories);
    this.userStore = new UserStore(this.api.auth);
    this.cartStore = new CartStore(this.api.cart);
    this.modalStore = new ModalStore();

    reaction(
      () => this.userStore.isAuthorized,
      (isAuthorized => {
        if (isAuthorized) {
          this.cartStore.fetchCart();
        }
      }),
      { fireImmediately: true }
    );
    reaction(
      () => this.userStore.isAuthorized,
      (isAuthorized => {
        if (!isAuthorized) {
          this.cartStore.resetCart();
        }
      }),
    );
  }
}
