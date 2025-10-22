"use client";

import clsx from 'clsx';
import { memo } from 'react';
import style from './MainMenu.module.scss';
import { usePathname } from 'next/navigation';
import AppMenu from '@constants/app-menu';
import Link from 'next/link';
import Text from '@components/Text';

const MainMenu = () => {
  const path = usePathname();

  return (
    <nav className={clsx(style['menu'])}>
      {AppMenu.map((item) => (
        <Link 
          key={item.path} 
          href={item.path} 
          className={clsx(
            style['menu-item__link'], path === item.path && style['menu-item__link_active'])}
        >
          <Text weight="bold" className={clsx(style['menu-item__name'])}>
            {item.title}
          </Text>
        </Link>
      ))}
    </nav>
  );
};

export default memo(MainMenu);
