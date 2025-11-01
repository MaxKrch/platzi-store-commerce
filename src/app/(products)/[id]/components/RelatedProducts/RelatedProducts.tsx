"use client";
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import style from './RelatedProducts.module.scss';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { useProductsStore } from '@providers/ProductsStoreProvider';
import { useProductDetailsStore } from '@providers/ProductDetailsStoreProvider';
import { META_STATUS } from '@constants/meta-status';
import Text from '@components/Text';
import CardList from '@components/CardList';
import CardListSkeleton from '@components/CardList/CardListSkeleton';
import NetworkError from '@components/NetworkError';
import DefaultNetworkErrorContentSlot from '@components/NetworkError/slots/DefaultNetworkErrorContentSlot';
import DefaultNetworkErrorActionSlot from '@components/NetworkError/slots/DefaultNetworkErrorActionSlot';
import DefaultCardCaptionSlot from '@components/Card/slots/DefaultCardCaptionSlot';
import DefaultCardPriceSlot from '@components/Card/slots/DefaultCardPriceSlot';
import DefaultCardActionSlot from '@components/Card/slots/DefaultCardActionSlot';

const RelatedProducts: React.FC = () => {
  const productDetailsStore = useProductDetailsStore();
  const productsStore = useProductsStore();

  const refetch = useCallback(() => {
    const currentProduct = productDetailsStore.product;

    if(currentProduct) {
      productsStore.fetchProducts({ category: currentProduct.categoryId });
    }
  }, [productsStore, productDetailsStore.product]);
  
  const filteredProducts = useMemo(
    () => productsStore.products.filter(item => item.id !== productDetailsStore.product?.id), 
    [productsStore.products, productDetailsStore.product]
  );
  
  const isFailedRequest = productsStore.status === META_STATUS.ERROR;
  const notFoundProducts = productsStore.status === META_STATUS.SUCCESS && productsStore.products.length === 0;
  const showRelatedProducts = productsStore.status === META_STATUS.SUCCESS && productDetailsStore.status === META_STATUS.SUCCESS; 

  let content: ReactNode;
  switch(true) {
    case isFailedRequest: {
      content = (
        <NetworkError
          ContentSlot={DefaultNetworkErrorContentSlot}
          ActionSlot={() => <DefaultNetworkErrorActionSlot action={refetch} />}
        />
      );
      break;
    }

    case notFoundProducts: {
      content = (
        <Text>
          Нет похожих товаров, кажется - вы нашли что-то уникальное
        </Text>
      );
      break;
    }

    case showRelatedProducts: {
      content =(
        <CardList
          display="preview"
          products={filteredProducts}
          CaptionSlot={DefaultCardCaptionSlot}
          PriceSlot={DefaultCardPriceSlot}
          ActionSlot={DefaultCardActionSlot}
          className={clsx(style['related-products'])}
        />
      );
      break;
    }

    default: {
      content = (
        <CardListSkeleton  
          display="preview"
          skeletonCount={6}
          className={clsx(style['related-products'])}
        />
      );
    }
  }

  return (
    <div className={clsx(style['related-products__container'])}>
      {!isFailedRequest &&
        <Text color="primary" weight="bold" className={clsx(style['related-products__title'])}>
          Вам понравится
        </Text>
      }
      {content}
    </div>
  );
};

export default observer(RelatedProducts);