"use client";

import Button from "@components/Button";
import { ProductType } from "@model/products";
import React, { useCallback, useEffect, useState } from "react";
import { useRootStore } from "@providers/RootStoreContext";
import { observer } from "mobx-react-lite";
import Counter from "@components/Counter";
import clsx from "clsx";
import style from '../Card.module.scss';

export type DefaultCardActionSlot = {
  product: ProductType, 
  priority?: 'primary' | 'secondary',
  className?: string,
}

const DefaultCardActionSlot: React.FC<DefaultCardActionSlot> = ({ product, priority = 'primary', className }) => {
  const { cartStore, userStore, modalStore } = useRootStore();
  const [mounted, setMounted] = useState(false);
  const productFromCart = cartStore.getProductById(product.id);
  const count =  productFromCart?.quantity ?? 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = useCallback(
    (product: ProductType) => {
      if(!userStore.isAuthorized) {
        modalStore.open('auth');
        return;
      }

      cartStore.addToCart(product);
    },
    [cartStore, modalStore, userStore.isAuthorized]
  );

  const handleAddProduct = useCallback(() => {
      if(!userStore.isAuthorized) {
        modalStore.open('auth');
        return;
      }
      cartStore.addToCart(product);
  }, [cartStore, product, modalStore, userStore.isAuthorized]);

  const handleRemoveProduct = useCallback(() => {
      if(!userStore.isAuthorized) {
        modalStore.open('auth');
        return;
      }
      cartStore.removeFromCart(product);
  }, [cartStore, product, modalStore, userStore.isAuthorized]);

  return (
    <div className={clsx(style['action-slot'], className)}>
      {count === 0 || !mounted
        ? (
          <Button
            priority={priority} 
            onClick={() => handleClick(product)} 
            className={clsx(style['action-slot__button'])}
          >
            В корзину
          </Button>
        ):(
          <Counter
            priority={priority}
            className={clsx(style['action-slot__button'])}
            count={count}
            onInc={handleAddProduct}
            onDec={handleRemoveProduct}
          />
        )
      }
    </div>
  );
};
  

export default observer(DefaultCardActionSlot);
