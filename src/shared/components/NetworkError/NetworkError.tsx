"use client";

import clsx from 'clsx';
import type React from 'react';

import style from './NetworkError.module.scss';

export type NetworkErrorProps = {
  ContentSlot: React.FC;
  ActionSlot?: React.FC;
  className?: string;
};

const NetworkError: React.FC<NetworkErrorProps> = ({ ContentSlot, ActionSlot }) => {
  return (
    <section className={clsx(style['error'])}>
      <div className={clsx(style['error__content-slot'])}>
        <ContentSlot />
      </div>
      <div className={clsx(style['error__action-slot'])}>
        {ActionSlot && <ActionSlot />}
      </div>
    </section>
  );
};

export default NetworkError;
