import { clsx } from 'clsx';
import React from 'react';
import style from './CardList.module.scss';
import Card, { CardProps } from '@components/Card/Card';
import { ProductType } from '@model/products';

export type CardListProps = Pick<CardProps, 'PriceSlot' | 'CaptionSlot' |  'PriceSlot' | 'ActionSlot' | 'className'> & {
  display?: 'preview' | 'full';
  products: ProductType[];
};

const CardList: React.FC<CardListProps> = ({
  products = [],
  display,
  CaptionSlot,
  ActionSlot,
  PriceSlot,
  className,
}) => {
  return (
    <div className={clsx(style['card-list__wrapper'], className)}>
      <ul className={clsx(style['card-list'])}>
        {products.map((product) => (
          <li key={product.documentId}>
            <Card
              display={display}
              className={clsx(style['card-list__item'])}
              product={product}
              CaptionSlot={CaptionSlot}
              PriceSlot={PriceSlot}
              ActionSlot={ActionSlot}
            />
          </li>
        ))}
      </ul> 
    </div>
  );
};

export default CardList;
