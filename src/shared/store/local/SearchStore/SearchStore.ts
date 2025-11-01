import { META_STATUS } from '@constants/meta-status';
import { DEFAULT_SORT, SORT_VARIABLES, SortKeys } from '@constants/product-sort';
import { Option } from '@model/option-dropdown';
import { QueryParams } from '@model/query-params';
import { ILocalStore } from '@store/hooks/useLocalStore';
import RootStore from '@store/RootStore/RootStore';

import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  type IReactionDisposer,
} from 'mobx';

export const defaultValue: Option = {
  key: 'any',
  value: 'Любая категория',
};

function isSortKey(key: string): key is SortKeys {
  return Object.keys(SORT_VARIABLES).includes(key);
}

type PrivateFields =
  | '_inputValue'
  | '_initFromQueryParamsStore'
  | '_resetQuery'

export default class SearchStore implements ILocalStore {
  private _rootStore: RootStore;
  private _inputValue: string = '';
  private _debounce: ReturnType<typeof setTimeout> | null = null;

  reactions: IReactionDisposer[] = [];

  constructor({
    rootStore,
  }: {
    handleChange: (params: QueryParams) => void;
    rootStore: RootStore;
  }) {
    makeObservable<SearchStore, PrivateFields>(this, {
      _inputValue: observable,

      changeInput: action.bound,
      setCategory: action.bound,
      setActiveSort: action.bound,
      setMinPrice: action.bound,
      setMaxPrice: action.bound,

      _resetQuery: action,
      _initFromQueryParamsStore: action,

      inputValue: computed,

      sortOptions: computed,
      selectedSortOption:computed,
      titleSortValue: computed, 

      categoryOptions: computed,
      selectedCategoryOption: computed,
      titleCategoryValue: computed,
    });

    this._rootStore = rootStore;
    this.initReactions();
    this._initFromQueryParamsStore();
  }

  initReactions(): void {
    const reactionChangeInput = reaction(
      () => this._rootStore.queryParamsStore.query,
      (query) => {
        if(query !== this._inputValue) {
          this._inputValue = query ?? '';
        }
      }
    );
    this.reactions.push(reactionChangeInput);
  }

  get sortOptions(): Option[] {
    return Object.values(SORT_VARIABLES).map(item => ({
      key: item.key,
      value: item.label
    }));
  }

  get selectedSortOption(): Option {
    const currentSort = SORT_VARIABLES[this._rootStore.queryParamsStore.sort ?? DEFAULT_SORT];
    return ({
      key: currentSort.key,
      value: currentSort.label
    });
  }

  get titleSortValue(): string {
    return SORT_VARIABLES[this._rootStore.queryParamsStore.sort ?? DEFAULT_SORT].label;
  }

  get categoryOptions(): Option[] {
    const loadedCategoriesOptions = this._rootStore.categoriesStore.list.map(item => ({
      key: `${item.id}`,
      value: item.name,
    }));

    return [defaultValue, ...loadedCategoriesOptions];
  }

  get selectedCategoryOption(): Option {   
    const categoryId = this._rootStore.queryParamsStore.category;
    if(categoryId === null || categoryId === undefined) {
      return defaultValue;
    }

    const category = this._rootStore.categoriesStore._list.entities.get(categoryId);

    if(!category) {
      return defaultValue;
    }

    return ({
      key: categoryId.toString(),
      value: category.name,
    });
  }

  get titleCategoryValue(): string {
    const categoryId = this._rootStore.queryParamsStore.category;
    if(categoryId === null || categoryId === undefined) {
      return defaultValue.value;
    }
    
    const category = this._rootStore.categoriesStore._list.entities.get(categoryId);

    if(!category) {
      return defaultValue.value;
    }
    
    return category.name;
  }

  get inputValue(): string {
    return this._inputValue;
  }

  get minPrice(): QueryParams['minPrice'] {
    return this._rootStore.queryParamsStore.minPrice;
  }

  get maxPrice(): QueryParams['maxPrice'] {
    return this._rootStore.queryParamsStore.maxPrice;
  } 

  _resetQuery(): void {
    if (this._debounce) {
      clearTimeout(this._debounce);
      this._debounce = null;
    }

    this._rootStore.queryParamsStore.mergeQueryParams({
      query: '',
      category: null,
      minPrice: null,
      maxPrice: null
    });
  }

  changeInput(value: string): void {
    if (this._debounce) {
      clearTimeout(this._debounce);
    }
    this._inputValue = value;
    this._debounce = setTimeout(
      () => this._rootStore.queryParamsStore.mergeQueryParams({
        query: value,
      }),
      1000
    );
  }

  setCategory(option: Option): void {    
    if (this._rootStore.categoriesStore.status !== META_STATUS.SUCCESS) {
      return;
    }

    
    this._rootStore.queryParamsStore.mergeQueryParams({
      category: option.key === defaultValue.key ? null : Number(option.key),
    });
  }

  setMinPrice(value: number | null): void {
    this._rootStore.queryParamsStore.mergeQueryParams({
      minPrice: value,
    });
  }

  setMaxPrice(value: number | null): void {
    this._rootStore.queryParamsStore.mergeQueryParams({
      maxPrice: value,
    });    
  }

  setActiveSort(option: Option ): void {
    const { key } = option;

    if(!isSortKey(key)) {
      return;
    }
   
    this._rootStore.queryParamsStore.mergeQueryParams({
      sort: key,
    });
  }
 
  private _initFromQueryParamsStore(): void {
    this._inputValue = this._rootStore.queryParamsStore.query ?? '';   
  }

  clearReactions(): void {
    this.reactions.map(item => item());
    this.reactions = [];
  }

  destroy(): void {
    if (this._debounce) {
      clearTimeout(this._debounce);
    }
  }
}
