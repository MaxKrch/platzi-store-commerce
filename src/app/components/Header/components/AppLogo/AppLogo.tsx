"use client";

import Link from 'next/link';
import style from './AppLogo.module.scss';
import { appRoutes } from '@constants/app-routes';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import LogoIcon from '@components/icons/LogoIcon';
import AppNameIcon from '@components/icons/AppNameIcon';
import { usePathname } from 'next/navigation';

const AppLogo: React.FC = () => {
  const path = usePathname();
  const Component: React.FC<PropsWithChildren> = path === appRoutes.main.mask
    ? ({children}) => <p className={clsx(style['logo'])}>{children}</p>
    : ({children}) => <Link href={appRoutes.main.create()} className={clsx(style['logo'])}>{children}</Link>;

  return (
    <Component>
      <LogoIcon />
      <AppNameIcon className={clsx(style['logo__name'])} />
    </Component>
  );
};

export default AppLogo;
