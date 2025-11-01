"use client";

import Text from "@components/Text";
import { ProductType } from "@model/product";
import clsx from "clsx";
import React, { memo } from "react";
import style from '../Card.module.scss';

const DefaultCardPriceSlot: React.FC<{ product: ProductType, className?: string }> = ({ product, className }) => {
  return (
    <div className={clsx(style['price-slot'], className)}>
      <Text color="primary" className={clsx(style['price-slot__title'])}>
        Цена:
      </Text>
      <Text color="primary" weight="bold"  className={clsx(style['price-slot__discounter'])}>
        ${product.price}
      </Text>
    </div>

  );
};

export default memo(DefaultCardPriceSlot);
