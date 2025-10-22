"use client";
import { clsx } from 'clsx';
import CardList from '@components/CardList';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
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

const ProductList: React.FC = () => {
  const isFirstRender = useRef(true);
  const prevQueryString = useRef<string | null>(null);
  const requestId = useRef<string | null>(null);
  const productsStore = useProductsStore();
  const { queryParamsStore } = useRootStore();
  
  const refetch = useCallback(() => {
    productsStore.fetchProducts(queryParamsStore.queryObject);
  }, [productsStore, queryParamsStore]);

  useEffect(() => {
    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const nextQueryString = queryParamsStore.queryString;
    if (nextQueryString === prevQueryString.current) {
      return;
    } 

    const id = `${Date.now()}-${Math.random()}`;
    requestId.current = id;
    prevQueryString.current = nextQueryString;

    productsStore.fetchProducts(queryParamsStore.queryObject, id);
  }, [queryParamsStore.queryObject, queryParamsStore.queryString, productsStore]);

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
              {productsStore.pagination?.total}
            </Text>
          </div>
          <CardList
            display="preview"
            products={productsStore.products}
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
