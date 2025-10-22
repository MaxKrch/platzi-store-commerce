"use client";

import Text from "@components/Text";
import { ProductType } from "@model/products";
import clsx from "clsx";
import React, { memo } from "react";
import style from '../Card.module.scss';
import getPriceWithDiscount from "../utils/get-price-with-discount";

const DefaultCardPriceSlot: React.FC<{ product: ProductType, className?: string }> = ({ product, className }) => {
  return (
    <div className={clsx(style['price-slot'], className)}>
      <Text color="primary" className={clsx(style['price-slot__title'])}>
        Цена:
      </Text>
      {product.discountPercent > 0 &&
        <Text color="primary" className={clsx(style['price-slot__full'])}>
          ${product.price}
        </Text>
      }
      <Text color="primary" weight="bold"  className={clsx(style['price-slot__discounter'])}>
        ${getPriceWithDiscount(product.price, product.discountPercent )}
      </Text>
    </div>

  );
};

export default memo(DefaultCardPriceSlot);
