"use client";

import useLocalStore from "@store/hooks/useLocalStore";
import React, { createContext, PropsWithChildren } from "react";
import { useRootStore } from "./RootStoreContext";
import { useStrictContext } from "@hooks/useSctrictContext";
import ProductDetailsStore from "@store/local/ProductDetailsStore";
import { ProductDetailsInitData } from "@store/local/ProductDetailsStore/ProductDetailsStore";

export type ProductDetailsProviderProps = PropsWithChildren<{
  initData: ProductDetailsInitData
}>

const ProductDetailsContext = createContext<ProductDetailsStore | null>(null);
const ProductDetailsStoreInnerProvider: React.FC<ProductDetailsProviderProps> = ({ children, initData }) => {
    const rootStore = useRootStore();
    const store = useLocalStore(() => new ProductDetailsStore({
        rootStore,
        initData,
    }));
    
    return(
        <ProductDetailsContext.Provider value={store}>
            {children}
        </ProductDetailsContext.Provider>
    );
};

export const ProductDetailsStoreProvider: React.FC<ProductDetailsProviderProps> = ({ children, initData }) => {
    return(
        <ProductDetailsStoreInnerProvider initData={initData}>
            {children}
        </ProductDetailsStoreInnerProvider>
    ); 
};

export const useProductDetailsStore = () => useStrictContext({
    context: ProductDetailsContext,
    message: "ProductDetyailsContext was not provided"
});