"use client";

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import style from './Cart.module.scss';
import CartSummary from './components/CartSummary';
import CartProducts from './components/CartProducts';

const CartPage: React.FC = () => {
  return (
    <div className={clsx(style['cart'])}>
      <CartProducts className={clsx(style['cart-products'])} />
      <CartSummary className={clsx(style['cart-summary'])}/> 
    </div>
  );
};

export default observer(CartPage);

