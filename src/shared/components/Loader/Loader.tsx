import clsx from 'clsx';
import React from 'react';

import style from './Loader.module.scss';

export type LoaderProps = {
  size?: 's' | 'm' | 'l';
  className?: string;
  color?: 'primary' | 'secondary'
};

const sizeClasses = {
  s: style['loader-size_s'],
  m: style['loader-size_m'],
  l: style['loader-size_l'],
} as const;

const colorClasses = {
  primary: style['loader-color_primary'],
  secondary: style['loader-color_secondary'],
} as const;

const Loader: React.FC<LoaderProps> = ({ size = 'l', color = 'primary', className }) => {
  const classes = clsx(style['loader'], sizeClasses[size], colorClasses[color], className);

  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={classes}>
      <path
        d="M13.3497 17.8462C10.1209 18.5916 6.89917 16.5785 6.15374 13.3497C5.40832 10.1209 7.42148 6.89919 10.6503 6.15377C13.879 5.40835 17.1008 7.42151 17.8462 10.6503L19.7949 10.2004C18.801 5.89534 14.5054 3.21113 10.2004 4.20503C5.89532 5.19893 3.21111 9.49456 4.205 13.7996C5.1989 18.1046 9.49454 20.7888 13.7996 19.795L13.3497 17.8462Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Loader;
