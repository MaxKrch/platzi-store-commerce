import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import style from './ImageGallery.module.scss';
import { ProductType } from '@model/product';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import CrossIcon from '@components/icons/CrossIcon';
import ArrowRightIcon from '@components/icons/ArrowRightIcon';

export type ImageGalleryProps = {
  images: ProductType['images'];
  previewSizes?: string
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, previewSizes }) => {
  const [mode, setMode] = useState<'preview' | 'full'>('preview');
  const [index, setIndex] = useState(0);

  const handleClickImg = useCallback(() => {
    if(mode === 'preview') {
      setMode('full');
    }
  }, [mode]);

  const handleClickLeftArrow = useCallback(() => {
    const nextIndex = index === 0 
      ? images.length - 1 
      : index - 1;
    setIndex(nextIndex);
  }, [index, images.length]);

  const handleClickRightArrow = useCallback(() => {
    const nextIndex = index + 1 < images.length
      ? index + 1
      : 0;
      setIndex(nextIndex);
  }, [index, images.length]);

  const handleClickCross = useCallback(() => {
    setMode('preview');
  }, []);

  useEffect(() => {
    if(mode === 'full') {
      document.body.classList.add(style['gallery_no-scroll']);
    } else {
      document.body.classList.remove(style['gallery_no-scroll']);
    }

    return () => document.body.classList.remove(style['gallery_no-scroll']);
  }, [mode]);

  return (
    <div className={clsx(style['gallery'], style[`gallery_${mode}`])}>
      {mode === 'full' &&
        <div 
          className={clsx(
            style['gallery__icon-container'], 
            style['gallery__cross-container']
          )} 
          onClick={handleClickCross}
        >
          <CrossIcon className={clsx(style['gallery__icon'])}/>
        </div>
      }

      <div
        onClick={handleClickLeftArrow} 
        className={clsx(
          style['gallery__icon-container'],
          style['gallery__arrow-container'], 
          style['gallery__arrow-container_left'], 
        )}
      >
        <ArrowRightIcon className={clsx(
          style['gallery__icon'],
          style['gallery__arrow'], 
          style['gallery__arrow_left'],
        )}/>
      </div>

      <div 
        onClick={handleClickRightArrow}
        className={clsx(
          style['gallery__icon-container'],
          style['gallery__arrow-container'], 
          style['gallery__arrow-container_right'], 
        )}
      >
        <ArrowRightIcon className={clsx(
          style['gallery__icon'],
          style['gallery__arrow'], 
          style['gallery__arrow_right']
        )}/>
      </div>

      {mode === 'full' &&
        <div className={clsx(style['gallery__bg'])}></div>
      }

      <div 
        className={clsx(style['gallery__image-container'])} 
        onClick={handleClickImg}
      >
        {
          images.map((img, currentIndex) => (
            <Image
              key={img}
              className={clsx(
                style['gallery__image'], 
                style[`gallery__image_${mode}`], 
                currentIndex === index && style['gallery__image_active']
              )}
              src={img}
              alt={img ?? 'Card Image'}
              fill
              sizes={(mode === 'preview' && previewSizes) ? previewSizes : '100vh'}
              priority
            />
          ))
        }
      </div>
    </div>
  );
};

export default observer(ImageGallery);
