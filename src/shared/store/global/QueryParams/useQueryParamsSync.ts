"use client";

import QueryParamsStore from "./QueryParamsStore";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { reaction } from "mobx";

const useQueryParamsSync = (store: QueryParamsStore) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const path = usePathname();
    const prevPathRef = useRef(path);
    const queryString = searchParams.toString();

    useEffect(() => {
        if(path === prevPathRef.current) {
            return;
        }

        store.setFromSearchParams(searchParams);
        prevPathRef.current = path;
    }, [searchParams, store, path]);

    useEffect(() => {
        const dispose = reaction(
            () => store.queryString,
            newQuery => {
                const currentQuery = searchParams.toString();
                if(newQuery === currentQuery) {
                    return;
                }
                const href = newQuery ? `?${newQuery}` : '/';
                window.history.replaceState(null, "", href);
            },
            { fireImmediately: false }
        );
        return () => dispose();
    }, [queryString, searchParams, store, router]);
};

export default useQueryParamsSync;