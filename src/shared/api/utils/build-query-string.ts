import qs from 'qs';
import { QueryParams } from '@model/query-params';
import { DEFAULT_SORT, SORT_VARIABLES } from '@constants/product-sort';

type buildQueryStringArgs = QueryParams & {
  populate?: string[] | string | object;
};

export function buildQueryString(params: buildQueryStringArgs, type: 'products' | 'categories' = 'products') {
  const { page = 1, count = 9, query, categories, populate, inStock, sort } = params;

  const strapiQuery: Record<string, unknown> = {
    pagination: {
      page,
      pageSize: count,
    },
  };

  if (populate) {
    strapiQuery.populate = populate;
  }

  if(type === 'products') {
    if (query) {
      strapiQuery.filters = {
        ...(strapiQuery.filters || {}),
        title: { $containsi: query },
      };
    }

    if (Array.isArray(categories)) {
      strapiQuery.filters = {
        ...(strapiQuery.filters || {}),
        productCategory: {
          id: { $in: categories },
        },
      };
    }

    if (inStock) {
      strapiQuery.filters = {
        ...(strapiQuery.filters || {}),
        isInStock: { $eq: true },
      };
    }

    const currentSort = sort ? sort : DEFAULT_SORT;
    const currentSortApi = SORT_VARIABLES[currentSort].api;
    strapiQuery.sort = `${currentSortApi.field}:${currentSortApi.order}`;
  }
  
  return qs.stringify(strapiQuery);
}