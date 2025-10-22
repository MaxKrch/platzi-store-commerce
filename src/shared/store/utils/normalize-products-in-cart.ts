import { ProductInCart, ProductInCartApi } from '@model/cart';
import { normalizeProductItem } from './normalize-products';

const normalizeProductInCartItem = (from: ProductInCartApi): ProductInCart => ({
  product: normalizeProductItem(from.product),
  quantity: from.quantity,
});

const normalizeProductInCartList = (from: ProductInCartApi[]): ProductInCart[] => {
  return from.map((product) => normalizeProductInCartItem(product));
};

export { normalizeProductInCartItem, normalizeProductInCartList };
