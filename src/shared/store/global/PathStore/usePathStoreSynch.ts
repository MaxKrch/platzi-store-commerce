"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import PathStore from "./PathStore";

const usePathSynch = (store: PathStore) => {
    const path = usePathname();
    
    useEffect(() => {
        if(store.pathString !== path) {
            store.synchWithPath(path);
        }
    }, [store, path]);
};

export default usePathSynch;