import React from 'react';
import style from './CategoriesList.module.scss';
import { CategoriesInitData } from '@store/global/CategoriesStore/CategoriesStore';
import InitCategoriesStore from '../InitCategoriesStore';
import clsx from 'clsx';
import { normalizeCategoriesList } from '@store/utils/normalize-categories';
import Category from './components/Category';

const CategoriesList: React.FC<{ initData: CategoriesInitData }> = async ({ initData }) => {
    const categories = initData.success
        ? normalizeCategoriesList(initData.categories)
        : [];
    return(
        <div className={clsx(style['categories-list__wrapper'])}>
            <InitCategoriesStore initData={initData} />
            {initData.success &&
                <ul className={clsx(style['categories-list'])}>
                    {categories.map((item) => (
                        <li key={item.id} className={clsx(style['categories-list__item'])}>
                            <Category category={item}/>
                        </li>
                    ))}
                </ul>
            }
        </div>     
    );
};

export default CategoriesList;