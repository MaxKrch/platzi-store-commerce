import { SortKeys } from "@constants/product-sort";

export type QueryParams = Partial<{
  page: number;
  count: number;
  categories: number[];
  query: string;
  sort: SortKeys;
  inStock: boolean;
}>
