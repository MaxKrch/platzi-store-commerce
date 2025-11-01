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
import SingleDropdown from '@components/SingleDropdown';
import PriceFilter from './components/PriceFilter';

const ProductSearch = () => {
  const { categoriesStore, queryParamsStore } = useRootStore();
  const searchStore = useSearchStore();
  const productsStore = useProductsStore();

  const handleInputCrossClick = useCallback(() => {
    searchStore.changeInput('');
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
        options={searchStore.categoryOptions}
        selectedOption={searchStore.selectedCategoryOption}
        onSelect={searchStore.setCategory}
        getTitle={() => searchStore.titleCategoryValue}
        className={clsx(style['search__categories-filter'])} 
      />
      
      <SingleDropdown 
        options={searchStore.sortOptions}
        selectedOption={searchStore.selectedSortOption}
        onSelect={searchStore.setActiveSort}
        getTitle={() => searchStore.titleSortValue}
        className={clsx(style['search__sort'])} 
      />
      
      <PriceFilter
        minValue={searchStore.minPrice}
        onChangeMin={searchStore.setMinPrice}
        maxValue={searchStore.maxPrice}
        onChangeMax={searchStore.setMaxPrice}
        className={clsx(style['search__price'])} 
      />

    </div>
  );
};

export default observer(ProductSearch);