import { Collection } from "@model/collections";
import getInitialCollection from "@store/utils/get-initial-collection";
import { META_STATUS, MetaStatus } from "@constants/meta-status";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import CategoriesApi from "@api/CategoriesApi";
import { linearizeCollection } from "@store/utils/linearize-collection";
import { normalizeCollection } from "@store/utils/normalize-collection";
import { normalizeCategoriesList } from "@store/utils/normalize-categories";
import { ProductCategoryApiType, ProductCategoryType } from "@model/category";

export type ICategoriesStore = {
  getCategoryById: (id: ProductCategoryType['id']) => ProductCategoryType | undefined;
};

export type CategoriesInitData = {
    success: true,
    categories: ProductCategoryApiType[],
} | {
    success: false,
    error: string,
}

type PrivateFields = 
  | '_status' 
  | '_error'
  | '_setCategories';

export default class CategoriesStore implements ICategoriesStore {
  private _api: CategoriesApi;
  private _status: MetaStatus = META_STATUS.IDLE;
  private _abortCtrl: AbortController | null = null;
  private _error: string | null = null;
  private _isInitialized = false;
  _list: Collection<ProductCategoryType['id'], ProductCategoryType> = getInitialCollection();

  constructor(api: CategoriesApi) {
    makeObservable<CategoriesStore, PrivateFields>(this, {
      _list: observable,
      _status: observable,
      _error: observable,

      list: computed,
      status: computed,
      error: computed,

      setInitData: action.bound,
      fetchCategories: action.bound,
      _setCategories: action,
    });
    this._api = api;
  }

  get list(): ProductCategoryType[] {
    return linearizeCollection(this._list);
  }

  get status(): MetaStatus {
    return this._status;
  }

  get error(): string | null {
    return this._error;
  }

  private _setCategories(categories: ProductCategoryApiType[]): void {
      const normalized = normalizeCollection(
        normalizeCategoriesList(categories),
        (element) => element.id
      );

      runInAction(() => {
        this._list = normalized;
        this._status = META_STATUS.SUCCESS;
      });
  }

  setInitData(init: CategoriesInitData): void {
    if(this._isInitialized) {
      return;
    } 

    this._isInitialized = true;

    if(!init.success) {
      this._error = init.error;
      this._status = META_STATUS.ERROR;
      
      return;
    }

    this._status = META_STATUS.SUCCESS;
    this._setCategories(init.categories);
  }

  setCategories(categories: ProductCategoryApiType[]): void {
    this._setCategories(categories);
  }

  getCategoryById(id: ProductCategoryType['id']): ProductCategoryType | undefined {
    return this._list.entities.get(id);
  }

  abort(): void {
    if (this._abortCtrl) {
      this._abortCtrl.abort();
      this._abortCtrl = null;
    }
  }

  async fetchCategories(): Promise<void> {
    this.abort();
    this._abortCtrl = new AbortController();

    runInAction(() => {
      this._status = META_STATUS.PENDING;
      this._list = getInitialCollection();
    });

    try {
      const response = await this._api.getCategories({ signal: this._abortCtrl.signal });
      
      runInAction(() => {     
        this._setCategories(response);
        this._status = META_STATUS.SUCCESS; 
      });

    } catch (err) {      
      if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
  
      runInAction(() => {
        this._list = getInitialCollection();
        this._status = META_STATUS.ERROR;
      });
    }
  }
}
