import React, { memo, useCallback } from 'react';
import { Option } from '@model/option-dropdown';
import Dropdown from '@components/Dropdown';

export type SingleDropdownProps = {
  className?: string;
  options: Option[];
  selectedOption: Option;
  onSelect: (value: Option) => void;
  disabled?: boolean;
  getTitle: () => string;
};

const SingleDropdown: React.FC<SingleDropdownProps> = ({
  options,
  selectedOption,
  onSelect,
  disabled,
  getTitle,
  className,
}) => {
  const handleSelect = useCallback((option: Option) => {
    if(option.key === selectedOption.key) {
      return;
    } 
   
    const isCorrectOption = options.includes(option);
    if (isCorrectOption) {
      onSelect(option);
    }
  },  [selectedOption, options, onSelect]);

  return (
    <Dropdown 
      options={options}
      selected={[selectedOption]}
      onSelect={handleSelect}
      disabled={disabled}
      className={className}
      getTitle={getTitle}
      mode='single'
    />
  );
};

export default memo(SingleDropdown);
