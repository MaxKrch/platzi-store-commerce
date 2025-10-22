import React, { useCallback, type ChangeEvent } from 'react';
import CheckBox, { CheckBoxProps } from './CheckBox';

export type CheckBoxValueAdapterProps = Omit<CheckBoxProps, 'onChange'> & {
  onChange: (checked: boolean) => void;
};

const CheckBoxValueAdapter = React.forwardRef<HTMLInputElement, CheckBoxValueAdapterProps>(
  ({ onChange, ...rest }, ref) => {
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
      },
      [onChange]
    );

    return (
        <CheckBox
          {...rest}
          onChange={handleChange}
          ref={ref}
        />
    );
  }
);

CheckBoxValueAdapter.displayName = "CheckBoxValueAdapter";
export default CheckBoxValueAdapter;