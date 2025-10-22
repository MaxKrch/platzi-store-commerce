"use client";

import clsx from 'clsx';
import React, { memo } from 'react';

import style from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  priority?: 'primary' | 'secondary';
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  priority = 'primary',
  className,
  children,
  loading,
  disabled,
  ...rest
}) => {
  const classes = clsx(
    style['button'],
    style[`button-${priority}`],
    loading && style[`button-${priority}_loading`],
    disabled && style[`button-${priority}_disabled`],
    className
  );

  return (
    <button {...rest} className={classes} disabled={loading || disabled}>
      {children}
    </button>
  );
};

export default memo(Button);
