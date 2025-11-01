import { META_STATUS, MetaStatus } from "@constants/meta-status";
import { Collection } from "@model/collections";
import { ProductApiType, ProductType } from "@model/product";
import { QueryParams } from "@model/query-params";
import { ILocalStore } from "@store/hooks/useLocalStore";
import RootStore from "@store/RootStore/RootStore";
import getInitialCollection from "@store/utils/get-initial-collection";
import { linearizeCollection } from "@store/utils/linearize-collection";
import { normalizeCollection } from "@store/utils/normalize-collection";
import { normalizeProductList } from "@store/utils/normalize-products";
import { action, computed, IReactionDisposer, makeObservable, observable, runInAction } from "mobx";

type PrivateFields = 
    | '_products' 
    | '_status' 
    | '_error'
    | '_requestId' 
    | '_setProducts';

export type ProductsInitData = {
    success: true,
    products: ProductApiType[],
    query: string,
} | {
    success: false,
    query: string,
    error: string,
}

export type ProductsStoreArgs = {
  rootStore: RootStore,
  initData: ProductsInitData
}

export default class ProductsStore implements ILocalStore {
  private _products: Collection<ProductType['id'], ProductType> = getInitialCollection();
  private _status: MetaStatus = META_STATUS.IDLE;
  private _requestId: string | undefined = undefined;
  private _abortCtrl: AbortController | null = null;
  private _rootStore: RootStore;
  private _error: string | null = null;
  private _isInitialized = false;
  reactions: IReactionDisposer[];

  constructor({ rootStore, initData }: ProductsStoreArgs) {
    makeObservable<ProductsStore, PrivateFields>(this, {
      _products: observable,
      _status: observable,
      _requestId: observable,
      _error: observable,

      products: computed,
      status: computed,
      requestId: computed,
      countProducts: computed,
      error: computed,

      fetchProducts: action.bound,
      resetProductList: action.bound,
      _setInitData: action,
      _setProducts: action,
    });

    this._rootStore = rootStore;
    this.reactions = [];
    this.initReactions();
    this._setInitData(initData);
  }

  initReactions(): void {
      
  }

  get products(): ProductType[] {
    return linearizeCollection(this._products);
  }

  get status(): MetaStatus {
    return this._status;
  }

  get error(): string | null {
    return this._error;
  }

  get requestId(): string | undefined {
    return this._requestId;
  }

  get countProducts(): number {
    return this._products.order.size;
  }

  private _setProducts(products: ProductApiType[] | null) {
    if (!products) {
      this._products = getInitialCollection();
      return;
    }

    this._products = normalizeCollection(
        normalizeProductList(products), 
        (product) => product.id
    );
  }

  _setInitData = (init: ProductsInitData): void => {
    if(this._isInitialized) {
      return;
    } 

    this._isInitialized = true;

    if(!init.success) {
        this._status = META_STATUS.ERROR;
        this._error = init.error;
        return;
    }

    this._setProducts(init.products);
    this._status = META_STATUS.SUCCESS;
  };

  getProductById(id: ProductType['id']): ProductType | undefined {
    return this._products.entities.get(id);
  }

  resetProductList(): void {
    this._products = getInitialCollection();
    this._requestId = undefined;
    this._status = META_STATUS.IDLE;
  }

  async fetchProducts(params: QueryParams, requestId?: string): Promise<void> {
    if (this._abortCtrl) {
      this._abortCtrl.abort();
    }
    this._abortCtrl = new AbortController();

    runInAction(() => {
      this._status = META_STATUS.PENDING;
      this._requestId = requestId;
      this._error = null;
      this._setProducts(null);
    });

    try {
      const response = await this._rootStore.api.products.getProductList(
        params, {signal: this._abortCtrl.signal }
      );

      runInAction(() => {
        this._setProducts(response);
        this._abortCtrl = null;
        this._status = META_STATUS.SUCCESS;
      });

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      runInAction(() => {
        this._requestId = undefined;
        this._error = err instanceof Error ? err.message : "UnknownError"; 
        this._setProducts(null);
        this._status = META_STATUS.ERROR;
      });
    }
  }

  clearReactions(): void {      
  }

  destroy(): void {      
  }
}
