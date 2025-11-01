"use client";
import { clsx } from 'clsx';
import CardList from '@components/CardList';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import style from './ProductList.module.scss';
import { useProductsStore } from '@providers/ProductsStoreProvider';
import { META_STATUS } from '@constants/meta-status';
import { notFound } from 'next/navigation';
import NetworkError from '@components/NetworkError';
import DefaultNetworkErrorContentSlot from '@components/NetworkError/slots/DefaultNetworkErrorContentSlot';
import DefaultNetworkErrorActionSlot from '@components/NetworkError/slots/DefaultNetworkErrorActionSlot';
import CardListSkeleton from '@components/CardList/CardListSkeleton';
import Text from '@components/Text';
import DefaultCardCaptionSlot from '@components/Card/slots/DefaultCardCaptionSlot';
import DefaultCardPriceSlot from '@components/Card/slots/DefaultCardPriceSlot';
import DefaultCardActionSlot from '@components/Card/slots/DefaultCardActionSlot';
import { useRootStore } from '@providers/RootStoreContext';
import sortProducts from '@utils/sort-products';
import { QueryParams } from '@model/query-params';

const ProductList: React.FC = () => {
  const isFirstRender = useRef(true);
  const prevQuery = useRef<QueryParams | null>(null);
  const requestId = useRef<string | null>(null);
  const productsStore = useProductsStore();
  const { queryParamsStore } = useRootStore();
  const sortedProducts = useMemo(() => {
    return sortProducts(productsStore.products, queryParamsStore.sort);
  }, [productsStore.products, queryParamsStore.sort]);
  
  const refetch = useCallback(() => {
    productsStore.fetchProducts(queryParamsStore.queryObject);
  }, [productsStore, queryParamsStore]);

  useEffect(() => {
    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
   
    if (
      queryParamsStore.category === prevQuery.current?.category && 
      queryParamsStore.query === prevQuery.current?.query &&
      queryParamsStore.minPrice === prevQuery.current?.minPrice &&
      queryParamsStore.maxPrice === prevQuery.current?.maxPrice &&
      queryParamsStore.page === prevQuery.current?.page
    ) {
      return;
    } 

    const id = `${Date.now()}-${Math.random()}`;
    requestId.current = id;
    
    prevQuery.current = {
      category: queryParamsStore.category,
      query: queryParamsStore.query,
      minPrice: queryParamsStore.minPrice,
      maxPrice: queryParamsStore.maxPrice,
      page: queryParamsStore.page
    };

    productsStore.fetchProducts(queryParamsStore.queryObject, id);
  }, [queryParamsStore, queryParamsStore.queryString, productsStore]);

  if(productsStore.error === 'NotFound' || productsStore.error === 'Not Found') {
    notFound();
  }

  const isFailedRequest = productsStore.status === META_STATUS.ERROR ||
    (productsStore.status === META_STATUS.SUCCESS && !!productsStore.requestId && !!requestId.current && productsStore.requestId !== requestId.current);

  const notFoundProducts = productsStore.status === META_STATUS.SUCCESS && productsStore.products.length === 0;
  const showProducts = productsStore.status === META_STATUS.SUCCESS;

  let content: ReactNode;
  switch(true) {
    case isFailedRequest: {
      content = (
        <NetworkError
          ContentSlot={DefaultNetworkErrorContentSlot} 
          ActionSlot={() => <DefaultNetworkErrorActionSlot action={refetch}/>} 
        />
      );
      break;
    }
    case notFoundProducts: {
      content = (
        <div className={clsx(style['product-list__not-found'])}>
          <Text view='title' className={clsx(style['product-list-title__name'])}>
            Ничего не найдено
          </Text>
          <Text view='p-20'>
            Попробуйте изменить запрос 
          </Text>          
        </div>

      );
      break;
    }

    case showProducts: {
      content = (
        <>
          <div className={clsx(style['product-list-title'])}>
            <Text color="primary" weight="bold" className={clsx(style['product-list-title__name'])}>
              Найдено товаров
            </Text>
            <Text view="p-20" color="secondary" className={clsx(style['product-list-title__count'])}>
              {productsStore.products.length}
            </Text>
          </div>
          <CardList
            display="preview"
            products={sortedProducts}
            CaptionSlot={DefaultCardCaptionSlot}
            PriceSlot={DefaultCardPriceSlot}
            ActionSlot={DefaultCardActionSlot}
          />
        </>
      );
      break;
    }

    default: {
      content = (
        <>
          <Text color="primary" weight="bold" className={clsx(style['product-list-title__name'])}>
            Найдено товаров
          </Text>
          <CardListSkeleton skeletonCount={6} display="preview" />
        </>
      );
    }
  }

  return (
    <div className={clsx(style['product-list'])}>
      {content}
    </div>
  );
};

export default observer(ProductList);
