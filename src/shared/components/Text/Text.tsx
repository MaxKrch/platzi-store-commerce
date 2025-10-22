import clsx from 'clsx';
import React from 'react';

import style from './Text.module.scss';

export type TextProps = {
  children: React.ReactNode;
  className?: string;
  view?: 'title' | 'button' | 'p-20' | 'p-18' | 'p-16' | 'p-14';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
  weight?: 'normal' | 'medium' | 'bold';
  color?: 'primary' | 'secondary' | 'accent' | 'inherit';
  maxLines?: number;
};

const viewClasses = {
  title: style['view-title'],
  button: style['view-button'],
  ['p-20']: style['view-p-20'],
  ['p-18']: style['view-p-18'],
  ['p-16']: style['view-p-16'],
  ['p-14']: style['view-p-14'],
};

const weightClasses = {
  normal: style['weight-normal'],
  medium: style['weight-medium'],
  bold: style['weight-bold'],
};

const colorClasses = {
  primary: style['color-primary'],
  secondary: style['color-secondary'],
  accent: style['color-accent'],
  inherit: style['color-inherit'],
};

const Text: React.FC<TextProps> = ({
  color = 'inherit',
  tag: Tag = 'p',
  view,
  weight = 'normal',
  className,
  children,
  maxLines,
}) => {
  const style: React.CSSProperties = maxLines
    ? {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLines,
        overflow: 'hidden',
      }
    : {};

  const classes = clsx(
    view && viewClasses[view],
    weightClasses[weight],
    colorClasses[color],
    className
  );

  return (
    <Tag className={classes} style={style}>
      {children}
    </Tag>
  );
};

export default Text;
