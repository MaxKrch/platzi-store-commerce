import React, { useCallback, useRef, useState, useEffect } from 'react';
import style from './PriceFilter.module.scss';
import clsx from 'clsx';
import CrossIcon from '@components/icons/CrossIcon';
import { observer } from 'mobx-react-lite';
import { addSpaces, removeSpaces } from '@utils/format-numbers';

const DEBOUNCE = 1000;

export type PriceFilterProps = {
  minValue: number | null | undefined,
  onChangeMin: (value: number | null) => void, 
  maxValue: number | null | undefined,
  onChangeMax: (value: number | null) => void, 
  className?: string
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  minValue,
  onChangeMin, 
  maxValue,
  onChangeMax, 
  className
}) => {
  const [localMin, setLocalMin] = useState<string>(minValue?.toString() || '');
  const [localMax, setLocalMax] = useState<string>(maxValue?.toString() || '');
  
  const changeMinDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const changeMaxDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalMin(minValue?.toString() || '');
  }, [minValue]);

  useEffect(() => {
    setLocalMax(maxValue?.toString() || '');
  }, [maxValue]);

  const clearMinTimeout = useCallback(() => {
    if(changeMinDebounce.current) {
      clearTimeout(changeMinDebounce.current);
    }
  }, []);

  const clearMaxTimeout = useCallback(() => {
    if(changeMaxDebounce.current) {
      clearTimeout(changeMaxDebounce.current);
    }
  }, []);

  const updateMinValue = useCallback((value: string) => {
    setLocalMin(value);
    clearMinTimeout();
    
    if (value !== '' && localMax !== '' && Number(value) > Number(localMax)) {
      return;
    }

    if (value === '') {
      changeMinDebounce.current = setTimeout(() => onChangeMin(null), DEBOUNCE);
    } else {
      const numValue = Number(value);
      changeMinDebounce.current = setTimeout(() => onChangeMin(numValue), DEBOUNCE);
    }
  }, [onChangeMin, clearMinTimeout, localMax]);

  const updateMaxValue = useCallback((value: string) => {
    setLocalMax(value);
    clearMaxTimeout();

    
    if (value !== '' && localMin !== '' && Number(value) < Number(localMin)) {
      return;
    }
    
    if (value === '') {
      changeMaxDebounce.current = setTimeout(() => onChangeMax(null), DEBOUNCE);
    } else {
      const numValue = Number(value);
      changeMaxDebounce.current = setTimeout(() => onChangeMax(numValue), DEBOUNCE);
    }
  }, [onChangeMax, clearMaxTimeout, localMin]);

  const handleChangeMinPrice = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = removeSpaces(event.target.value);

    if (newValue !== '' && isNaN(Number(newValue))) {
      return;
    }

    updateMinValue(newValue);
  }, [updateMinValue]);

  const handleChangeMaxPrice = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = removeSpaces(event.target.value);
    
    if (newValue !== '' && isNaN(Number(newValue))) {
      return;
    }

    updateMaxValue(newValue);
  }, [updateMaxValue]);

  const handleBlurMinPrice = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = removeSpaces(event.target.value);

    if(isNaN(Number(value))) {
      updateMinValue('');
    }

    if(localMax !== '' && value !== '' && Number(value) > Number(localMax)) {
      updateMinValue(localMax);
    }
  }, [localMax, updateMinValue]);

  const handleBlurMaxPrice = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = removeSpaces(event.target.value);

    if(isNaN(Number(value))) {
      updateMaxValue('');
    }

    if(localMin !== '' && value !== '' && Number(value) < Number(localMin)) {
      updateMaxValue(localMin);
    }    
  }, [localMin, updateMaxValue]);

  useEffect(() => {
    return () => {
      clearMinTimeout();
      clearMaxTimeout();
    };
  }, [clearMinTimeout, clearMaxTimeout]);

  return (
    <div className={clsx(style['price-filter'], className)}>
      <div className={clsx(style['price-filter-title'])}>
        Цена:
      </div>

      <div className={clsx(style['price-filter-section'], style['price-filter-min'])}>
        <label className={clsx(style['price-filter-section__label'])}>
          <div className={clsx(style['price-filter-section__description'])}>
            От $
          </div>
          <input
            className={clsx(style['price-filter-section__input'])} 
            type="text" 
            value={addSpaces(localMin)}
            inputMode="numeric"
            placeholder='1'
            min={1}
            onChange={handleChangeMinPrice}
            onBlur={handleBlurMinPrice}
          />
        </label>
        <div className={clsx(style['price-filter-section__clear'])}>
          {localMin !== '' && <CrossIcon onClick={() => updateMinValue('')} className={clsx(style['price-filter-section__clear-icon'])}/>}        
        </div>
      </div>

      <div className={clsx(style['price-filter-section'], style['price-filter-max'])}>
        <label className={clsx(style['price-filter-section__label'])}>
          <div className={clsx(style['price-filter-section__description'])}>
            До $
          </div>
          <input 
            className={clsx(style['price-filter-section__input'])} 
            type="text" 
            value={addSpaces(localMax)}
            inputMode="numeric"
            placeholder='1 000 000'
            max={999999999}
            onChange={handleChangeMaxPrice}
            onBlur={handleBlurMaxPrice}
          />
        </label>
        <div className={clsx(style['price-filter-section__clear'])}>
          {localMax && <CrossIcon onClick={() => updateMaxValue('')} className={clsx(style['price-filter-section__clear-icon'])}/>}        
        </div>      
      </div>
    </div>
  );
};

export default observer(PriceFilter);