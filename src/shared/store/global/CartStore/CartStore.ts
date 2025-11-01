import { ProductInCart } from "@model/cart";
import { Collection } from "@model/collections";
import { ProductType } from "@model/product";
import getInitialCollection from "@store/utils/get-initial-collection";
import { action, computed, makeObservable, observable } from "mobx";
import { linearizeCollection } from "@store/utils/linearize-collection";
import { normalizeCollection } from "@store/utils/normalize-collection";
import CartStorage from "@services/CartStorage";

type PrivateFields =
  | '_products'
  | '_setProducts'
  | '_addToCartItem'
  | '_removeFromCartItem'
  | '_error'

export default class CartStore {
  private _products: Collection<ProductType['id'], ProductInCart> = getInitialCollection();
  private _abortCtrl: AbortController | null = null;
  private _error: string | null = null;
  constructor() {
    makeObservable<CartStore, PrivateFields>(this, {
      _products: observable,
      _error: observable,

      products: computed,
      totalPrice: computed,
      totalItemsToOrder: computed,
      error: computed,

      _setProducts: action,
      _addToCartItem: action,
      _removeFromCartItem: action,
      loadCart: action.bound,
    });
  }

  get products(): ProductInCart[] {
    return linearizeCollection(this._products);
  }


  get totalItemsToOrder(): number {
    return this.products.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  get totalPrice(): number {
    return this.products.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);
  }
 
  get error(): string | null {
    return this._error;
  }


  getProductById(id: ProductType['id']): ProductInCart | undefined {
    return this._products.entities.get(id);
  }

 
  addToCart = (product: ProductType): void => {
    this._addToCartItem(product);
    CartStorage.saveProducts(this.products);
  };

  removeFromCart = (product: ProductType): void => {
    this._removeFromCartItem(product);
    CartStorage.saveProducts(this.products);
  };
  
  removeAllProductItems(product: ProductType): void {
    const item = this._products.entities.get(product.id);
    if (!item) {
      return;
    }
    
    this._removeFromCartItem(product, item.quantity);
  }

  loadCart(): void {
    this._error = null;
    this._setProducts(CartStorage.loadProducts());
  }

  private _addToCartItem(product: ProductType, quantity: number = 1): void {
    const targetProduct = this._products.entities.get(product.id);
    if (targetProduct) {
      targetProduct.quantity += quantity;
    }

    if(!targetProduct) {
      this._products.order.add(product.id);
      this._products.entities.set(product.id, { quantity, product });      
    }
  }

  private _removeFromCartItem(product: ProductType, quantity: number = 1): void {
    const targetProduct = this._products.entities.get(product.id);

    if (!targetProduct) {
      return;
    }

    if (targetProduct.quantity > quantity) {
      targetProduct.quantity -= quantity;

    } else {
      this._products.order.delete(product.id);
      this._products.entities.delete(product.id);      
    }
  }

  private _setProducts(products: ProductInCart[]): void {
    this._products = normalizeCollection(
      products,
      (element) => element.product.id
    );
  }
}
