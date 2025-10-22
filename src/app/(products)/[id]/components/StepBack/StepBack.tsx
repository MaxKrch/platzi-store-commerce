import clsx from 'clsx';
import { memo } from 'react';
import style from './StepBack.module.scss';
import StepButton from '@components/StepButton';

const StepBack = () => {
  return (
    <div className={clsx(style['stepback'])}>
      <StepButton direction="back">Назад</StepButton>
    </div>
  );
};

export default memo(StepBack);
