"use client";

import clsx from 'clsx';
import React, { PropsWithChildren, useCallback } from 'react';
import style from './UserActions.module.scss';
import Link from 'next/link';
import { appRoutes } from '@constants/app-routes';
import BagIcon from '@components/icons/BagIcon';
import UserIcon from '@components/icons/UserIcon';
import { useRootStore } from '@providers/RootStoreContext';
import Text from '@components/Text';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import { MODES } from '@constants/modal';
import OnlyClient from '@components/OnlyClient';

const UserActions = () => {
  const path = usePathname();
  const router = useRouter();
  const { 
    cartStore,
    authStore,
    modalStore,
    pathStore
  } = useRootStore();

  const CartComponent: React.FC<PropsWithChildren> = path === appRoutes.cart.mask
    ? ({ children }) => <p>{children}</p>
    : ({ children }) => <Link href={appRoutes.cart.create()}>{children}</Link>;

  const handleUserIconClick = useCallback(() => {
    if(authStore.isAuthorized && path !== appRoutes.my.create()) {
      pathStore.updateURL(router, appRoutes.my.create());
    }

    if(!authStore.isAuthorized) {
      modalStore.open(MODES.AUTH);
    }
  }, [pathStore, modalStore, authStore.isAuthorized, path, router]);  

  return (
    <div className={clsx(style['actions'])}>
      <div className={clsx(
        style['actions-cart'], 
        style['actions__item'], 
        path === appRoutes.cart.mask && style['actions__item_active']
      )}>
        <CartComponent>
          <BagIcon className={clsx(style['actions__icon'])} />
        </CartComponent>
        {cartStore.totalItemsToOrder > 0 &&
          <OnlyClient>
            <Text weight='bold' className={clsx(style['actions-cart__count'])}>
              {cartStore.totalItemsToOrder}
            </Text>
          </OnlyClient>
        }
      </div>
      <div onClick={handleUserIconClick} className={clsx(style['actions__item'])}>
        <UserIcon className={clsx(style['actions__icon'])} />
      </div>
    </div>
  );
};

export default observer(UserActions);
