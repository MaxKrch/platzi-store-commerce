"use client";

import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import { KeyboardEvent, useCallback, useEffect } from 'react';
import style from './ProductSearch.module.scss';
import useSearchStore from '@store/local/SearchStore/useSearchStore';
import { META_STATUS } from '@constants/meta-status';
import { useProductsStore } from '@providers/ProductsStoreProvider';
import { useRootStore } from '@providers/RootStoreContext';
import SearchQuery from './components/SearchQuery';
import CategoriesFilter from './components/CategoriesFilter';
import Text from '@components/Text';
import CheckBox from '@components/CheckBox';
import SingleDropdown from '@components/SingleDropdown';

const ProductSearch = () => {
  const { categoriesStore, queryParamsStore } = useRootStore();
  const searchStore = useSearchStore();
  const productsStore = useProductsStore();

  const handleInputCrossClick = useCallback(() => {
    searchStore.changeInput('');
  }, [searchStore]);

  const handleFilterCrossClick = useCallback(() => {
    searchStore.setCategories([]);
  }, [searchStore]);

  const handleSearchClick = useCallback(() => {
    const params = queryParamsStore.queryObject;
    productsStore.fetchProducts(params);
  }, [queryParamsStore.queryObject, productsStore]);

  const handleInputKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter") {
      const params = queryParamsStore.queryObject;
      productsStore.fetchProducts(params);      
    }
  }, [queryParamsStore.queryObject, productsStore]);

  useEffect(() => {
    if(categoriesStore.status === META_STATUS.IDLE) {
      categoriesStore.fetchCategories();
    }
  }, [categoriesStore]);

  return (
    <div className={clsx(style['search'])}>
      <SearchQuery
        inputValue={searchStore.inputValue}
        onChange={searchStore.changeInput}
        onInputKeyDown={handleInputKeyDown}
        onInputCrossClick={handleInputCrossClick}
        onSearchClick={handleSearchClick}
        searchStatus={productsStore.status}
        className={clsx(style['search__query'])}
      />
      
      <SingleDropdown 
        options={searchStore.sortOptions}
        selectedOption={searchStore.selectedSortOption}
        onSelect={searchStore.setActiveSort}
        getTitle={() => searchStore.titleSortValue}
        className={clsx(style['search__sort'])} 
      />
      
      <CategoriesFilter
        options={searchStore.categoriesOptions}
        selectedOptions={searchStore.selectedCategoriesOptions}
        onSelect={searchStore.setCategories}
        getTitle={() => searchStore.titleCategoriesValue}
        status={categoriesStore.status}
        onFilterCrossClick={handleFilterCrossClick}
        className={clsx(style['search__categories-filter'])} 
      />

      <label className={clsx(style['search__stock'])}>
        <Text className={clsx(style['search__stock-description'])}>
          Только доступные для заказа:
        </Text>
        <CheckBox
          className={clsx(style['search__stock-icon'])}
          checked={!!searchStore.inStock}
          onChange={() => {searchStore.setInStock(!searchStore.inStock);}} 
          checkSize="small"
        />
      </label>
    </div>
  );
};

export default observer(ProductSearch);