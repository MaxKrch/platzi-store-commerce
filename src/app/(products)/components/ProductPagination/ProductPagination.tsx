"use client";

import Pagination from '@components/Pagination';
import normalizeCurrentPage from '@components/Pagination/utils/normalize-current-page';
import { useRootStore } from '@providers/RootStoreContext';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useCallback, useEffect, useMemo } from 'react';

const ProductPagination: React.FC = () => {
  const { queryParamsStore } = useRootStore();
  const pageCount = 10;
  const page = queryParamsStore.page ?? 1;

  const currentPage = useMemo(
    () => normalizeCurrentPage(page, pageCount),
    [page, pageCount]
  );

  useEffect(() => {
    if (pageCount && pageCount < page) {
      queryParamsStore.mergeQueryParams({ page: pageCount });
    }
  }, [pageCount, queryParamsStore, page]);

  const handleClick = useCallback(
    (page: number) => {
      if (page !== currentPage) {
        queryParamsStore.mergeQueryParams({ page });
      }
    },
    [currentPage, queryParamsStore]
  );

  return <Pagination currentPage={currentPage} onClick={handleClick} pageCount={pageCount} />;
};

export default observer(ProductPagination);
