"use client";

import useLocalStore from "@store/hooks/useLocalStore";
import ProductsStore, { ProductsInitData } from "@store/local/ProductsStore/ProductsStore";
import React, { createContext, PropsWithChildren } from "react";
import { useRootStore } from "./RootStoreContext";
import { useStrictContext } from "@hooks/useSctrictContext";

export type ProductsProviderProps = PropsWithChildren<{
  initData: ProductsInitData
}>;

const ProductsContext = createContext<ProductsStore | null>(null);
const ProductsStoreInnerProvider: React.FC<ProductsProviderProps> = ({ children, initData }) => {
    const rootStore = useRootStore();
    const store = useLocalStore(() => new ProductsStore({
        rootStore,
        initData
    }));

    return(
        <ProductsContext.Provider value={store}>
            {children}
        </ProductsContext.Provider>
    ); 
};

export const ProductsStoreProvider: React.FC<ProductsProviderProps> = ({ children , initData }) => {
    return(
        <ProductsStoreInnerProvider initData={initData}>
            {children}
        </ProductsStoreInnerProvider>
    ); 
};

export const useProductsStore = () => useStrictContext({
    context: ProductsContext,
    message: "ProductsContext was not provided"
});