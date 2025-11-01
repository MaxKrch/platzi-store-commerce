import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import style from './CartProducts.module.scss';
import { useRootStore } from '@providers/RootStoreContext';
import Card from '@components/Card';
import ClearProductsButton from './components/ClearProductsButton/ClearProductsButton';
import DefaultCardActionSlot from '@components/Card/slots/DefaultCardActionSlot';
import DefaultCardPriceSlot from '@components/Card/slots/DefaultCardPriceSlot';

const InStockProducts: React.FC<{className?: string}> = ({ className }) => {
  const { cartStore } = useRootStore();
  if (cartStore.products.length === 0) {
    return null;
  }

  return (
    <div className={clsx(style['cart-products'], className)}>
      <section className={clsx(style['cart-products__section'])}>
        {cartStore.products.length > 0 && (
          <ul className={clsx(style['cart-products__list'])}>
            {cartStore.products.map((item) => (
              <li key={item.product.id}>
                <Card
                  className={clsx(style['cart-products__card'])}
                  product={item.product}
                  display="cart"
                  PriceSlot={DefaultCardPriceSlot}
                  ActionSlot={() => (
                    <>
                      <ClearProductsButton product={item.product}/>
                      <DefaultCardActionSlot product={item.product}/> 
                    </>
                )}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default observer(InStockProducts);