"use client";

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import style from './ProductCard.module.scss';
import { useProductDetailsStore } from '@providers/ProductDetailsStoreProvider';
import { notFound, useParams } from 'next/navigation';
import { META_STATUS } from '@constants/meta-status';
import NetworkError from '@components/NetworkError';
import DefaultNetworkErrorContentSlot from '@components/NetworkError/slots/DefaultNetworkErrorContentSlot';
import DefaultNetworkErrorActionSlot from '@components/NetworkError/slots/DefaultNetworkErrorActionSlot';
import Card, { CardSkeleton } from '@components/Card';
import DefaultCardPriceSlot from '@components/Card/slots/DefaultCardPriceSlot';
import ProductCardAction from './components/ProductCardAction';

const ProductCard: React.FC = () => {
  const productDetailsStore = useProductDetailsStore();
  const isFirstRender = useRef(true);
  const prevProduct = useRef<string | null>(null);
  const { id: productId } = useParams();

  const refetch = useCallback(() => {
    if(typeof productId === 'string') {
      productDetailsStore.fetchProduct(productId);
    }
  }, [productDetailsStore, productId]);
  

  useEffect(() => {   
    if(isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if(typeof productId !== 'string' || productId === prevProduct.current) {
      return;
    }

    prevProduct.current = productId;

    productDetailsStore.fetchProduct(productId);
  }, [productId, productDetailsStore]);

  if(productDetailsStore.error === 'NotFound' || productDetailsStore.error === 'Not Found') {
    notFound();
  }

  const isFailedRequest = productDetailsStore.status === META_STATUS.ERROR 
    || (productDetailsStore.status === META_STATUS.SUCCESS && productDetailsStore.product?.documentId !== productId);

  const isSuccessRequest = productDetailsStore.status === META_STATUS.SUCCESS 
    && !!productDetailsStore.product;

  let content: ReactNode;
  switch (true) {
    case isFailedRequest: {
      content = (
        <NetworkError
          ContentSlot={DefaultNetworkErrorContentSlot}
          ActionSlot={() => <DefaultNetworkErrorActionSlot action={refetch} />}
        />
      );
      break;
    }

    case isSuccessRequest: {
      const product = productDetailsStore.product!;
      content = (
        <Card
          display="full"
          product={product}
          PriceSlot={() => <DefaultCardPriceSlot product={product} className={clsx(style['product-card__price-slot'])} />}
          ActionSlot={() => <ProductCardAction product={product} />}
        />
      );
      break;
    }

    default: {
      content = (<CardSkeleton display="full" />);
    }
  }

  return (
    <article className={clsx(style["product-card"])}>
      {content}
    </article>
  );
};

export default observer(ProductCard);
