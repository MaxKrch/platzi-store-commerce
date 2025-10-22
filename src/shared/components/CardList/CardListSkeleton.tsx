import { clsx } from 'clsx';
import React, { memo } from 'react';

import style from './CardList.module.scss';
import CardSkeleton from '@components/Card/components/Skeleton/CardSkeleton';

type CardListSkeletonProps = {
  display?: 'preview' | 'full';
  skeletonCount?: number;
  className?: string;
};

const CardList: React.FC<CardListSkeletonProps> = ({
  display = 'preview',
  skeletonCount = 6,
  className,
}) => {
  return (
    <div className={clsx(style['card-list__wrapper'], className)}>
      <ul className={clsx(style['card-list'])}>
        {Array(skeletonCount)
          .fill('')
          .map((item, index) => item + index)
          .map((item) => (
            <li key={item}>
              <CardSkeleton display={display} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default memo(CardList);
