import clsx from 'clsx';
import React from 'react';

import type { CardProps } from '../../Card';

import style from './CardSkeleton.module.scss';

export type CardSkeletonProps = Pick<CardProps, 'display' | 'className'>;
const CardSkeleton: React.FC<CardSkeletonProps> = ({ display }) => {
  return (
    <div className={clsx(style['skeleton'], style[display ?? ''])}>
      <div className={clsx(style['skeleton__image'], style[`${display}__image`])} />
      <div className={clsx(style['skeleton__main'], style[`${display}__main`])}>
        <div className={clsx(style['skeleton__title'], style[`${display}__title`])} />
        <div className={clsx(style['skeleton__description'], style[`${display}__description`])}>
          <p />
          <p />
          <p />
          <p />
        </div>
        <div className={clsx(style[`skeleton__footer`], style[`${display}__footer`])} />
      </div>
    </div>
  );
};

export default React.memo(CardSkeleton);
