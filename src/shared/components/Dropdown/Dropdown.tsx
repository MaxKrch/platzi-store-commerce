import clsx from 'clsx';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import style from './Dropdown.module.scss';
import { InputValueAdapter } from '@components/Input';
import ArrowDownIcon from '@components/icons/ArrowDownIcon';
import { Option } from '@model/option-dropdown';

export type DropdownProps = {
  className?: string;
  options: Option[];
  getTitle: (options: Option[]) => string,
  selected: Option[];
  onSelect: (value: Option) => void;
  disabled?: boolean;
  placeholder?: string;
  mode: 'single' | 'multi';
};

const isElement = (target: EventTarget | null): target is Element => {
  return target instanceof Element;
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  getTitle,
  selected,
  onSelect,
  disabled,
  className,
  mode
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const title = useMemo(() => getTitle(selected), [selected, getTitle]);
  const filteredOptions = useMemo(
    () => options.filter(item => item.value.toLowerCase().includes(inputValue.toLowerCase())),
    [options, inputValue]
  );

  const handleInputClick = useCallback(() => {
    if (!disabled && !isShowDropdown) {
      setIsShowDropdown(true);
    }
  }, [disabled, isShowDropdown]);

  const handleOptionClick = useCallback((event: React.MouseEvent<HTMLLIElement>) => {
    const id = event.currentTarget.dataset.id;
    const currentOptions = options.find(item => item.key === id);

    if(currentOptions) {
      onSelect(currentOptions);
    }

    if(mode === 'single') {
      setIsShowDropdown(false);
    }
  },  [options, onSelect, mode]);

  const handleInputBlur = useCallback(() => {
    setInputValue('');
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {  
    const target = event.target;
    if(!isElement(target)) {
      return;
    }

    if (containerRef.current?.contains(target) && target.closest('li')) {
      return;
    }

    if(containerRef.current && !containerRef.current.contains(target)) {
      setIsShowDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);
  
  return (
    <div ref={containerRef} className={clsx(style['dropdown-container'], className)}>
      <InputValueAdapter
        disabled={disabled}
        onChange={setInputValue}
        value={inputValue}
        ref={inputRef}
        afterSlot={<ArrowDownIcon color="secondary" />}
        placeholder={title}
        name="multiDropdownInput"
        onClick={handleInputClick}
        onBlur={handleInputBlur}
      />
      {isShowDropdown && !disabled && (
        <ul className={clsx(style['dropdown'])}>
          {filteredOptions.map((option) => (
            <li
              data-id={option.key}
              onClick={handleOptionClick}
              key={option.key}
              className={clsx(
                style['dropdown__option'],
                selected.find((item) => item.key === option.key) && style['dropdown__option_selected']
              )}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default memo(Dropdown);
