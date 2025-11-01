import qs from 'qs';
import { QueryParams } from '@model/query-params';

type buildQueryStringArgs = QueryParams & {
  limit?: number;
  offset?: number
};

export function buildQueryString(params: buildQueryStringArgs) {
  const { category, query, offset, page = 1, minPrice = 1, maxPrice = 1000000, limit = 30  } = params;
  const preparedPage = (page && page > 0) 
    ? page 
    : 1;
  const normalizedOffset = (offset && offset >= 0) 
    ? offset 
    : (preparedPage * limit);

  const platziQuery: Record<string, unknown> = {
    limit,
    offset: normalizedOffset,
  };

  if(category) {
    platziQuery.categoryId = category;
  }

  if(query) {
    platziQuery.title = query;
  }

  
  if(minPrice !== undefined) {
    platziQuery.price_min = minPrice;
  }

  
  if(maxPrice != undefined) {
    platziQuery.price_max = maxPrice;
  }

  return qs.stringify(platziQuery);
}