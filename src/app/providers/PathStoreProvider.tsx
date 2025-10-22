"use client";

import usePathSynch from "@store/global/PathStore/usePathStoreSynch";
import { PropsWithChildren } from "react";
import { useRootStore } from "./RootStoreContext";

const PathStoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { pathStore } = useRootStore();
    usePathSynch(pathStore);

    return(
        <>
            {children}
        </>
    );
};

export default PathStoreProvider;