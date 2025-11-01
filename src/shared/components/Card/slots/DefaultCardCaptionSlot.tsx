"use client";

import Text from "@components/Text";
import { appRoutes } from "@constants/app-routes";
import { ProductType } from "@model/product";
import { useRootStore } from "@providers/RootStoreContext";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import React, { memo, useCallback } from "react";
import style from '../Card.module.scss';

const DefaultCardCaptionSlot: React.FC<{ product: ProductType, className?: string }> = ({ product, className }) => {
  const router = useRouter();
  const path = usePathname();
  const { queryParamsStore, pathStore } = useRootStore();

  const handleClick = useCallback(() => {
    const category = product.category.id;

    if(path !== appRoutes.main.create()) {
      pathStore.updateURL(router, [appRoutes.main.create()]);    
    }
    
    queryParamsStore.mergeQueryParams({category});
  }, [path, router, queryParamsStore, pathStore, product]);

  return (
    <div onClick={handleClick}>
      <Text color="secondary" weight="bold" className={clsx(style['caption-slot__link'], className)}>
        {product.category.name}
      </Text>
    </div>
  );
};

export default memo(DefaultCardCaptionSlot);
