import { ProductType } from "@model/products";

export const appRoutes = {
  main: {
    mask: '/',
    create: () => '/',
  },
  product: {
    mask: '/:id',
    create: (id: ProductType['documentId']) => `/${id}`,    
  },
  categories: {
    mask: '/categories',
    create: () => '/categories',
  },
  cart: {
    mask: '/cart',
    create: () => '/cart',
  },
  my: {
    mask: '/my',
    create: () => '/my',
  },
  about: {
    mask: '/about',
    create: () => '/about',
  },
} as const;
