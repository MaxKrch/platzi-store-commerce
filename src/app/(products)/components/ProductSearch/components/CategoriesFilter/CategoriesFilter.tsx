import React, { memo } from 'react';
import style from './CategoriesFilter.module.scss';
import clsx from 'clsx';
import { META_STATUS, MetaStatus } from '@constants/meta-status';
import MultiDropdown from '@components/MultiDropdown';
import { Option } from '@model/option-dropdown';
import OnlyClient from '@components/OnlyClient';
import CrossIcon from '@components/icons/CrossIcon';

export type CategoriesFilterProps = {
    options: Option[],
    selectedOptions: Option[],
    onSelect: (options: Option[]) => void,
    getTitle: () => string,
    status: MetaStatus,
    className?: string,
    onFilterCrossClick: () => void
}
const CategoriesFilter: React.FC<CategoriesFilterProps> = ({
    options,
    selectedOptions,
    onSelect,
    getTitle,
    status,
    className,
    onFilterCrossClick
}) => {
    return (
        <div className={clsx(style['filter'], className)}>
        {status === META_STATUS.IDLE ? (
          <div className={clsx(style['filter'], style['filter__skeleton'])} />
        ) : (
          <MultiDropdown
            options={options}
            selectedOptions={selectedOptions}
            onSelect={onSelect}
            getTitle={getTitle}
            className={clsx(style['filter__dropdown'])}
          />
        )}
        <div className={clsx(style['filter__cross'])}>
          {selectedOptions.length > 0 &&
            <OnlyClient>
              <CrossIcon onClick={onFilterCrossClick} className={clsx(style['filter__icon'])} />
            </OnlyClient>
          }
        </div>
      </div>
    );
};

export default memo(CategoriesFilter);