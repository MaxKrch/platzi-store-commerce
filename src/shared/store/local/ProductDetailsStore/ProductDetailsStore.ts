import { META_STATUS, MetaStatus } from '@constants/meta-status';
import { ProductApiType, ProductType } from '@model/product';
import { ILocalStore } from '@store/hooks/useLocalStore';
import RootStore from '@store/RootStore/RootStore';
import { normalizeProductItem } from '@store/utils/normalize-products';
import { action, computed, IReactionDisposer, makeObservable, observable, runInAction } from 'mobx';

type PrivateFields = 
  | '_product' 
  | '_status' 
  | '_requestId'
  | '_error';

export type ProductDetailsInitData = {
    success: true,
    product: ProductApiType,
    id: string,
} | {
    success: false,
    id: string,
    error: string,
}

export type ProductsStoreArgs = {
  rootStore: RootStore,
  initData: ProductDetailsInitData
}


export default class ProductDetailsStore implements ILocalStore {
  private _product: ProductType | null = null;
  private _abortCtrl: AbortController | null = null;
  private _status: MetaStatus = META_STATUS.IDLE;
  private _requestId: string | undefined;
  private _rootStore: RootStore;
  private _error: string | null = null;
  private _isInitialized = false;
  reactions: IReactionDisposer[] = [];

  constructor({ rootStore, initData }: ProductsStoreArgs) {
    makeObservable<ProductDetailsStore, PrivateFields>(this, {
      _product: observable,
      _status: observable,
      _requestId: observable,
      _error: observable,

      product: computed,
      status: computed,
      requestId: computed,
      error: computed, 

      _setProduct: action,
      _setInitData: action,
      resetProduct: action.bound,
      fetchProduct: action.bound,
    });

    this._rootStore = rootStore;
    this.initReactions();
    this._setInitData(initData);
  }

  initReactions(): void {
      
  }

  get product(): ProductType | null {
    return this._product;
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

  _setInitData = (init: ProductDetailsInitData): void => {
    if(this._isInitialized) {
      return;
    } 

    this._isInitialized = true;

    if(!init.success) {
        this._status = META_STATUS.ERROR;
        this._error = init.error;
        return;
    }

    this._setProduct(init.product);
    this._status = META_STATUS.SUCCESS;
  };

  _setProduct(product: ProductApiType): void {
    this._product = normalizeProductItem(product);
  }

  resetProduct(): void {
    this._product = null;
    this._requestId = undefined;
    this._status = META_STATUS.IDLE;
  }

  async fetchProduct(id: ProductType['id'], requestId?: string): Promise<void> {
    if (this._abortCtrl) {
      this._abortCtrl.abort();
    }

    runInAction(() => {
      this._product = null;
      this._requestId = requestId;
      this._status = META_STATUS.PENDING;
    });

    this._abortCtrl = new AbortController();

    try {
      const response = await this._rootStore.api.products.getProductDetails(
       id, { signal: this._abortCtrl.signal }
      );

      runInAction(() => {
        this._product = normalizeProductItem(response);
        this._abortCtrl = null;
        this._status = META_STATUS.SUCCESS;
      });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      runInAction(() => {
        this._product = null;
        this._requestId = undefined;
        this._status = META_STATUS.ERROR;
      });
    }
  }
  
  clearReactions(): void {      
    this.reactions.map(item => item());
    this.reactions = [];
  }

  destroy(): void {
    if (this._abortCtrl) {
      this._abortCtrl.abort();
    }
  }
}
