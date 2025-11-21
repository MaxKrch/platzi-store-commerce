"use client";

import clsx from 'clsx';
import React, { PropsWithChildren, useCallback, useRef } from 'react';
import style from './UserActions.module.scss';
import Link from 'next/link';
import { appRoutes } from '@constants/app-routes';
import BagIcon from '@components/icons/BagIcon';
import UserIcon from '@components/icons/UserIcon';
import { useRootStore } from '@providers/RootStoreContext';
import Text from '@components/Text';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import { MODES } from '@constants/modal';
import OnlyClient from '@components/OnlyClient';
import { POPUP_TYPES } from '@store/global/PopupStore/PopupStore';
import UserMenu from '../UserMenu';

const UserActions = () => {
  const userMenuBtn = useRef<HTMLDivElement | null>(null);
  const path = usePathname();
  const { 
    cartStore,
    authStore,
    modalStore,
    popupStore
  } = useRootStore();

  const userMenuPopup = popupStore.getPopupByType(POPUP_TYPES.USER_MENU);

  const CartComponent: React.FC<PropsWithChildren> = path === appRoutes.cart.mask
    ? ({ children }) => <p>{children}</p>
    : ({ children }) => <Link href={appRoutes.cart.create()}>{children}</Link>;

  const handleUserIconClick = useCallback(() => {
    if(authStore.isAuthorized && !userMenuPopup) {   
      popupStore.addPopup({
        closeOnOutsideClick: true,
        type: POPUP_TYPES.USER_MENU,
      });
    } else if(!authStore.isAuthorized) {
      modalStore.open(MODES.AUTH);
    }
  }, [modalStore, authStore.isAuthorized, popupStore, userMenuPopup]);  

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
      <div
        ref={userMenuBtn}
        onClick={handleUserIconClick} 
        className={clsx(style['actions__item'], style['actions__user-menu-anchor'])}
      >
        <UserIcon className={clsx(style['actions__icon'])} />
        {userMenuPopup &&
          <UserMenu
            anchorEl={userMenuBtn.current}
          />
        }
      </div>
    </div>
  );
};

export default observer(UserActions);
