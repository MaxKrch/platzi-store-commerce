import { SortKeys } from "@constants/product-sort";

export type QueryParams = Partial<{
  category: number | null;
  query: string;
  sort: SortKeys;
  page: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}>
