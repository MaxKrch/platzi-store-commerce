export const SORT_VARIABLES = {
  newest: {
    key: 'newest',
    label: 'Новинки',
    api: {
      field: 'price',
      order: 'desc',
    },
  },
  popular: {
    key: 'popular',
    label: 'Популярные',
    api: {
      field: 'rating',
      order: 'desc',
    },
  },
  price_asc: {
    key: 'price_asc',
    label: 'Сначала дешевле',
    api: {
      field: 'price',
      order: 'asc',
    },
  },
  price_desc: {
    key: 'price_desc',
    label: 'Сначала дороже',
    api: {
      field: 'price',
      order: 'desc',
    },
  },
  discount: {
    key: 'discount',
    label: 'Со скидкой',
    api: {
      field: 'discountPercent',
      order: 'desc',
    },
  },
 } as const;

export type SortVariables = typeof SORT_VARIABLES[keyof typeof SORT_VARIABLES] 
export type SortKeys = SortVariables['key']
export const DEFAULT_SORT = SORT_VARIABLES.newest.key;

