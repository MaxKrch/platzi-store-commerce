import { Collection } from "@model/collections";
import { ProductCategoryApiType, ProductCategoryType } from "@model/products";
import getInitialCollection from "@store/utils/get-initial-collection";
import { META_STATUS, MetaStatus } from "@constants/meta-status";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import CategoriesApi from "@api/CategoriesApi";
import { linearizeCollection } from "@store/utils/linearize-collection";
import { normalizeCollection } from "@store/utils/normalize-collection";
import { normalizeCategoriesList } from "@store/utils/normalize-categories";
import { MetaResponse } from "@model/strapi-api";

export type ICategoriesStore = {
  getCategoryById: (id: ProductCategoryType['id']) => ProductCategoryType | undefined;
};

export type CategoriesInitData = {
    success: true,
    categories: ProductCategoryApiType[],
    meta: MetaResponse<ProductCategoryApiType[]>
} | {
    success: false,
    error: string,
}

type PrivateFields = 
  | '_status' 
  | '_meta' 
  | '_error'
  | '_setCategories';

export default class CategoriesStore implements ICategoriesStore {
  private _api: CategoriesApi;
  private _status: MetaStatus = META_STATUS.IDLE;
  private _meta: MetaResponse<CategoriesApi[]> | null = null;
  private _abortCtrl: AbortController | null = null;
  private _error: string | null = null;
  private _isInitialized = false;
  _list: Collection<ProductCategoryType['id'], ProductCategoryType> = getInitialCollection();

  constructor(api: CategoriesApi) {
    makeObservable<CategoriesStore, PrivateFields>(this, {
      _list: observable,
      _status: observable,
      _error: observable,
      _meta: observable,

      list: computed,
      status: computed,
      error: computed,
      pagination: computed,

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

  get pagination(): MetaResponse<ProductCategoryType[]>['pagination'] | undefined {
    return this._meta?.pagination;
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
    this._meta = init.meta;
    this._setCategories(init.categories);
  }

  setCategories(categories: ProductCategoryApiType[]): void {
    this._setCategories(categories);
  }

  getCategoryById(id: ProductCategoryType['id']): ProductCategoryType | undefined {
    return this._list.entities[id];
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
      this._meta = null;
      this._list = getInitialCollection();
    });

    try {
      const response = await this._api.getCategories({ signal: this._abortCtrl.signal });
      
      runInAction(() => {     
        this._setCategories(response.data);
        this._meta = response.meta;
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
