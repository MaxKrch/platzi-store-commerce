"use client";

import { useQueryParamsSync } from "@store/global/QueryParams";
import React, { PropsWithChildren } from "react";
import { useRootStore } from "./RootStoreContext";

export const QueryParamsStoreProvider: React.FC<PropsWithChildren> = ({children}) => {
    const { queryParamsStore } = useRootStore(); 
    useQueryParamsSync(queryParamsStore);
    return(
        <>
            {children}
        </>        
    );
};
