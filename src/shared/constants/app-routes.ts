import { ProductType } from "@model/product";

export const appRoutes = {
  main: {
    mask: '/',
    create: () => '/',
  },
  product: {
    mask: '/:id',
    create: (id: ProductType['id']) => `/${id}`,    
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
