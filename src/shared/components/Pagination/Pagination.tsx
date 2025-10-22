import clsx from 'clsx';
import { memo, useEffect, useMemo, useRef, type FC } from 'react';

import style from './Pagination.module.scss';
import getPageNumbers from './utils/get-page-numbers';
import ArrowRightIcon from '@components/icons/ArrowRightIcon';
import Text from '@components/Text';

export type PaginationProps = {
  currentPage: number;
  pageCount?: number;
  className?: string;
  visiblePageArround?: number;
  onClick: (page: number) => void;
};

const Pagination: FC<PaginationProps> = ({
  currentPage,
  pageCount,
  className,
  visiblePageArround = 2,
  onClick,
}) => {
  const refPage = useRef(currentPage);
  useEffect(() => {
    if (refPage.current !== currentPage) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      refPage.current = currentPage;
    }
  }, [currentPage]);

  const showLeftElipses = currentPage - visiblePageArround > 2;
  const showRightElipses = !!pageCount && currentPage + visiblePageArround < pageCount - 1;

  const pages = useMemo(
    () => getPageNumbers(currentPage, pageCount, visiblePageArround),
    [currentPage, pageCount, visiblePageArround]
  );

  return (
    <div className={clsx(style['pagination'], className)}>
      <div
        onClick={() => onClick(currentPage - 1)}
        className={clsx(style['pagination__page'], style['pagination__page_prev'], currentPage === 1 && style['pagination__page_disabled'])}
      >
        <ArrowRightIcon className={clsx(style['pagination__page_prev-icon'])} />
      </div>
      {showLeftElipses && <div className={clsx(style['pagination__elipses'], style['pagination__elipses_prev'])}>...</div>}
      <ul className={clsx(style['pagination__list'])}>
        {pages.map((item) => (
          <li
            className={clsx(style['pagination__page'], item === currentPage && style['pagination__page_current'])}
            key={item}
            onClick={() => onClick(item)}
          >
            <Text view="p-18" weight="medium">
              {item}
            </Text>
          </li>
        ))}
      </ul>
      {showRightElipses && (
        <div className={clsx(style['pagination__elipses'], style['pagination__elipses_next'])}>...</div>
      )}
      <div
        onClick={() => onClick(currentPage + 1)}
        className={clsx(
          style['pagination__page'],
          style['pagination__page_next'],
          currentPage === pageCount && style['pagination__page_disabled']
        )}
      >
        <ArrowRightIcon className={clsx(style['pagination__page_next-icon'])} />
      </div>
    </div>
  );
};

export default memo(Pagination);
