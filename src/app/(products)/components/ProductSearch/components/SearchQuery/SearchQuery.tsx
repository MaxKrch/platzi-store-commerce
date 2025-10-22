import React, { KeyboardEvent, memo } from 'react';
import style from './SearchQuery.module.scss';
import clsx from 'clsx';
import { InputValueAdapter } from '@components/Input';
import OnlyClient from '@components/OnlyClient';
import CrossIcon from '@components/icons/CrossIcon';
import Button from '@components/Button';
import { META_STATUS, MetaStatus } from '@constants/meta-status';
import Loader from '@components/Loader';
import SearchIcon from '@components/icons/SearchIcon';

export type SearchStoreProps = {
    inputValue: string,
    onChange: (value: string) => void,
    onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void,
    onInputCrossClick: () => void,
    onSearchClick: () => void,
    searchStatus: MetaStatus,
    className: string,
}

const SearchQuery: React.FC<SearchStoreProps> = ({ 
    inputValue,
    onChange,
    onInputKeyDown,
    onInputCrossClick,
    onSearchClick,
    searchStatus,
    className
}) => {

    return (      
        <div className={clsx(style['search-query'], className)}>
            <div className={clsx(style['search-query-input__wrapper'])}>
                <InputValueAdapter
                    value={inputValue}
                    onChange={onChange}
                    placeholder={'Что будем искать?'}
                    className={clsx(style['search-query-input'])}
                    name="searchInput"
                    onKeyDown={onInputKeyDown}
                />
                {inputValue.length > 0 &&
                    <OnlyClient>
                      <CrossIcon
                        onClick={onInputCrossClick}
                        className={clsx(style['search-query-input__cross'])}
                      />
                    </OnlyClient>
                } 
            </div>
    
            <Button
                onClick={onSearchClick}
                disabled={searchStatus === META_STATUS.PENDING}
                className={clsx(style['search-query-submit'])}
                name="searchButton"
            >
                {searchStatus === META_STATUS.PENDING 
                ? <Loader size='s' className={clsx(style['search-query-submit__icon'])}/>
                : <SearchIcon className={clsx(style['search-query-submit__icon'])} />
                }
                {<div className={clsx(style['search-query-submit__text'])}>Найти</div>}
            </Button>
        </div>
    );
};

export default memo(SearchQuery);