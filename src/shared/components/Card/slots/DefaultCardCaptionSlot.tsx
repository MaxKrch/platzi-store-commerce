"use client";

import Text from "@components/Text";
import { appRoutes } from "@constants/app-routes";
import { ProductType } from "@model/products";
import { useRootStore } from "@providers/RootStoreContext";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import React, { memo, useCallback } from "react";
import style from '../Card.module.scss';

const DefaultCardCaptionSlot: React.FC<{ product: ProductType, className?: string }> = ({ product, className }) => {
  const router = useRouter();
  const path = usePathname();
  const { queryParamsStore } = useRootStore();

  const handleClick = useCallback(() => {
    const categories = [product.productCategory.id];
    if(path === appRoutes.main.create()) {
      queryParamsStore.mergeQueryParams({categories});
   
    } else {
      router.push(`${appRoutes.main.create()}?categories=${categories}`);    
    }
  }, [path, router, queryParamsStore, product]);

  return (
    <div onClick={handleClick}>
      <Text color="secondary" weight="bold" className={clsx(style['caption-slot__link'], className)}>
        {product.productCategory.title}
      </Text>
    </div>
  );
};

export default memo(DefaultCardCaptionSlot);
