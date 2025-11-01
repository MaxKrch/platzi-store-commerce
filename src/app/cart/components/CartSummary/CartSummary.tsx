import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';

import style from './CartSummary.module.scss';
import { useRootStore } from '@providers/RootStoreContext';
import Text from '@components/Text';
import Button from '@components/Button';

const CartSummary: React.FC<{className?: string }> = ({ className }) => {
  const { cartStore } = useRootStore();
  return (
    <div className={className}>
      <section className={clsx(style['summary'])}>
        <Text tag="h3" color="primary" className={clsx(style['summary__title'])}>
          Ваша корзина:
        </Text>
        <div className={clsx(style['summary__total'])}>
          <Text className={clsx(style['summary__total-title'])}>Всего товаров:</Text>
          <Text className={clsx(style['summary__total-value'])}>{cartStore.totalItemsToOrder}</Text>
        </div>

        <div className={clsx(style['summary__total'])}>
          <Text className={clsx(style['summary__total-title'])}>Сумма заказа:</Text>
           
          <Text className={clsx(style['summary__total-value'])}>${cartStore.totalPrice}</Text>
        </div>
        <Button disabled={cartStore.products.length === 0} className={clsx(style['summary__button'])}>Перейти к оплате</Button>
      </section>
    </div>
  );
};

export default observer(CartSummary);
