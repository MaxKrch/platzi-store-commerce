import clsx from 'clsx';
import React from 'react';

import style from './Icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'inherit';
};

const colorClasses = {
  primary: style['color-primary'],
  secondary: style['color-secondary'],
  accent: style['color-accent'],
  inherit: style['color-inherit'],
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
  color = 'inherit',
  className,
  children,
  ...rest
}) => {
  const classes = clsx(colorClasses[color], className);

  return (
    <svg {...rest} xmlns="http://www.w3.org/2000/svg" className={classes}>
      {children}
    </svg>
  );
};

export default Icon;
