import { appRoutes } from './app-routes';

const AppMenu = [
  {
    title: 'Товары',
    path: appRoutes.main.create(),
  },
  {
    title: 'Категории',
    path: appRoutes.categories.create(),
  },
  {
    title: 'О нас',
    path: appRoutes.about.create(),
  },
] as const;

export default AppMenu;
