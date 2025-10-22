import clsx from 'clsx';
import React, { memo } from 'react';
import style from './Header.module.scss';
import AppLogo from './components/AppLogo';
import MainMenu from './components/MainMenu';
import UserActions from './components/UserActions';

const Header: React.FC = () => {
  return (
    <header className={clsx(style['header'])}>
      <div className={clsx(style['header__content'])}>
        <AppLogo />
        <MainMenu />
        <UserActions />
      </div>
    </header>
  );
};

export default memo(Header);
