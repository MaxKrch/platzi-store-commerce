import React from 'react';
import style from './Category.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import buildLinkWithCategoryFilter from './utils/build-link-with-category-filter';
import Text from '@components/Text';
import clsx from 'clsx';
import { ProductCategoryType } from '@model/category';

const Category: React.FC<{category: ProductCategoryType}> = ({ category }) => {
    const link = buildLinkWithCategoryFilter(category.id);

    return(
        <article className={clsx(style['category'])}>
            <Link className={clsx(style['category__link'])} href={link}>
                <div className={clsx(style['category__image-wrapper'])}>
                    <Image
                        className={clsx(style['category__image'])}
                        src={category.image}
                        alt={category.name ?? 'Category Image'}
                        sizes='600px'
                        fill
                    />
                </div>
                <Text weight='bold' view='title' className={clsx(style['category__description'])}>
                    {category.name}
                </Text>
            </Link>
        </article>
    );
};

export default Category;