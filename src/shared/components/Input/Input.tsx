import clsx from 'clsx';
import React from 'react';

import style from './Input.module.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, afterSlot, className, ...rest }, ref) => {
    return (
      <div className={clsx(style['input-container'], className)}>
        <input
          className={clsx(style['input'], afterSlot && style['input_with-icon'])}
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          {...rest}
        />
        {afterSlot && <div className={clsx(style['input__icon-container'])}>{afterSlot}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
