"use client";

import { usePathStoreSynch } from "@store/global/PathStore";
import { PropsWithChildren } from "react";
import { useRootStore } from "./RootStoreContext";

const PathStoreProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { pathStore } = useRootStore();
    usePathStoreSynch(pathStore);

    return(
        <>
            {children}
        </>
    );
};

export default PathStoreProvider;