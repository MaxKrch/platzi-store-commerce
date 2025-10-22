"use client";

import clsx from 'clsx';
import React, { memo, useCallback } from 'react';
import style from './StepButton.module.scss';
import { useRouter } from 'next/navigation';
import ArrowRightIcon from '@components/icons/ArrowRightIcon';
import Text from '@components/Text';

export type StepButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  direction: 'back' | 'go';
  children: React.ReactNode;
  className?: string;
};

const StepButton: React.FC<StepButtonProps> = ({ direction, children, className, ...rest }) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (direction === 'back') {
      router.back();
    } else {
      router.forward();
    }
  }, [direction, router]);

  return (
    <button className={clsx(style['button'], className)} onClick={handleClick} {...rest}>
      <ArrowRightIcon className={clsx(direction === 'back' && style['button_back'])} />
      <Text view="p-20" weight="bold">
        {children}
      </Text>
    </button>
  );
};

export default memo(StepButton);
