import clsx from 'clsx';
import React from 'react';

import style from './Skeleton.module.scss';

const Skeleton: React.FC = () => {
  return (
    <div className={clsx(style['skeleton'])}>
      <div className={clsx(style['list'])}>
        <div className={clsx(style['list-card'])}>
          <div className={clsx(style['list-card__img'])} />
          <div className={clsx(style['list-card__content'])}>
            <div className={clsx(style['list-card__title'])} />
            <div className={clsx(style['list-card__description'])} />
            <div className={clsx(style['list-card__button'])} />
          </div>
        </div>

        <div className={clsx(style['list-card'])}>
          <div className={clsx(style['list-card__img'])} />
          <div className={clsx(style['list-card__content'])}>
            <div className={clsx(style['list-card__title'])} />
            <div className={clsx(style['list-card__description'])} />
            <div className={clsx(style['list-card__button'])} />
          </div>
        </div>

        <div className={clsx(style['list-card'])}>
          <div className={clsx(style['list-card__img'])} />
          <div className={clsx(style['list-card__content'])}>
            <div className={clsx(style['list-card__title'])} />
            <div className={clsx(style['list-card__description'])} />
            <div className={clsx(style['list-card__button'])} />
          </div>
        </div>
      </div>

      <div className={clsx(style['summary'])}>
        <div className={clsx(style['summary__body'])}>
          <div className={clsx(style['summary__title'])} />
          <div className={clsx(style['summary__content'])} />
          <div className={clsx(style['summary__content'])} />
          <div className={clsx(style['summary__button'])} />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
