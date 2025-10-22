import clsx from 'clsx';
import style from '../NetworkError.module.scss';
import React from 'react';
import Text from '@components/Text';
import Image from 'next/image';

const DefaultNetworkErrorContentSlot: React.FC = () => {
  return (
    <>
      <Text color="primary" className={clsx(style['content-slot__title'])}>
        Кажется, что-то пошло не так
      </Text>
      <div className={clsx(style['content-slot__image-wrapper'])}>
        <Image
          src="/network-error.png"
          alt="Network Error" 
          className={clsx(style['content-slot__image'])}
          sizes='100vh'
          priority
          fill
        />
      </div>
      <Text color="primary" className={clsx(style['content-slot__body'])}>
        Попробуем снова?
      </Text>
    </>
  );
};

export default DefaultNetworkErrorContentSlot;
