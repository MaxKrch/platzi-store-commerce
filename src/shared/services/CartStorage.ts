"use client";

import { ProductInCart } from "@model/cart";

export default class CartStorage {
    static storageKey = 'products';

    static loadProducts(): ProductInCart[] {
        const productsJSON = localStorage.getItem(this.storageKey);
        
        return productsJSON ? JSON.parse(productsJSON) : [];
    }

    static saveProducts(products: ProductInCart[]): void {
        const productsJSON = JSON.stringify(products);

        localStorage.setItem(this.storageKey, productsJSON);
    }
}