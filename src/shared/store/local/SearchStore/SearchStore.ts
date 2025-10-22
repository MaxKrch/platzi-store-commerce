import { META_STATUS } from '@constants/meta-status';
import { DEFAULT_SORT, SORT_VARIABLES, SortKeys } from '@constants/product-sort';
import { Option } from '@model/option-dropdown';
import { ProductCategoryType } from '@model/products';
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

function isSortKey(key: string): key is SortKeys {
  return Object.keys(SORT_VARIABLES).includes(key);
}

type PrivateFields =
  | '_inputValue'
  | '_cleanupSelectedCategories'
  | '_initFromQueryParamsStore'
  | '_resetQuery'

export default class SearchStore implements ILocalStore {
  private _rootStore: RootStore;
  private _inputValue: string = '';
  private _debounce: ReturnType<typeof setTimeout> | null = null;
  private _handleChange: (params: QueryParams) => void;
  reactions: IReactionDisposer[] = [];

  constructor({
    handleChange,
    rootStore,
  }: {
    handleChange: (params: QueryParams) => void;
    rootStore: RootStore;
  }) {
    makeObservable<SearchStore, PrivateFields>(this, {
      _inputValue: observable,

      changeInput: action.bound,
      setCategories: action.bound,
      setActiveSort: action.bound,
      setInStock: action.bound,

      _resetQuery: action,
      _initFromQueryParamsStore: action,
      _cleanupSelectedCategories: action,

      inputValue: computed,
      inStock: computed,

      sortOptions: computed,
      selectedSortOption:computed,
      titleSortValue: computed, 

      categoriesOptions: computed,
      selectedCategoriesOptions: computed,
      titleCategoriesValue: computed,
    });

    this._handleChange = handleChange;
    this._rootStore = rootStore;
    this.initReactions();
    this._initFromQueryParamsStore();
  }

  initReactions(): void {
    const reactionLoadCategories = reaction(
      () => this._rootStore.categoriesStore.list,
      (categories) => {
        if (
          this._rootStore.categoriesStore.status !== META_STATUS.SUCCESS ||
          categories.length === 0
        ) {
          return;
        }

        this._cleanupSelectedCategories(categories);
      }
    );
    this.reactions.push(reactionLoadCategories);
    
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

  get categoriesOptions(): Option[] {
    return this._rootStore.categoriesStore._list.order.map(id => ({
      key: `${id}`,
      value: this._rootStore.categoriesStore._list.entities[id]?.title,
    }));
  }

  get selectedCategoriesOptions(): Option[] {   
    const categories = this._rootStore.queryParamsStore.categories ?? [];
    return categories.map(id => ({
      key: `${id}`,
      value: this._rootStore.categoriesStore._list.entities[id]?.title,
    }));
  }

  get titleCategoriesValue(): string {
    const categories = this._rootStore.queryParamsStore.categories ?? [];
    if (categories.length > 0) {
      return this.selectedCategoriesOptions.map((item) => item.value).join(', ');
    }

    return 'Любая категория';
  }

  get inputValue(): string {
    return this._inputValue;
  }

  get inStock(): boolean {
    return this._rootStore.queryParamsStore.inStock ?? false;
  }

  _resetQuery(): void {
    if (this._debounce) {
      clearTimeout(this._debounce);
      this._debounce = null;
    }

    this._rootStore.queryParamsStore.mergeQueryParams({
      query: '',
      categories: []
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

  setCategories(options: Option[]): void {    
    if (this._rootStore.categoriesStore.status !== META_STATUS.SUCCESS) {
      return;
    }
    
    const selected: ProductCategoryType['id'][] = [];
    
    options.forEach((item) => {
      const categoriesId = Number(item.key);
    
      if (this._rootStore.categoriesStore._list.order.includes(categoriesId)) {
        selected.push(categoriesId);
      };
    });
    
    this._rootStore.queryParamsStore.mergeQueryParams({
      categories: selected,
    });
  }

  setInStock(value: boolean): void {
    this._rootStore.queryParamsStore.mergeQueryParams({
      inStock: value,
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

  private _cleanupSelectedCategories(categories: ProductCategoryType[]): void {
    const selectedCategories = this._rootStore.queryParamsStore.categories ?? [];
    const cleanCategories = categories
      .filter((item) => selectedCategories.includes(item.id))
      .map(item => item.id);

    if(selectedCategories.length !== cleanCategories.length) {
      this._rootStore.queryParamsStore.mergeQueryParams({
        categories: cleanCategories
      });
    } 
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
