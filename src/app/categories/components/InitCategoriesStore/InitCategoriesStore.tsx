"use client";

import NetworkError from "@components/NetworkError";
import DefaultNetworkErrorActionSlot from "@components/NetworkError/slots/DefaultNetworkErrorActionSlot";
import DefaultNetworkErrorContentSlot from "@components/NetworkError/slots/DefaultNetworkErrorContentSlot";
import { useRootStore } from "@providers/RootStoreContext";
import { CategoriesInitData } from "@store/global/CategoriesStore/CategoriesStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const InitCategoriesStore: React.FC<{initData: CategoriesInitData}> = ({initData}) => {
    const initApplied = useRef(false);
    const { categoriesStore } = useRootStore();
    const router = useRouter();
    
    useEffect(() => {
        if(!initApplied.current && initData.success) {
            categoriesStore.setCategories(initData.categories);
            initApplied.current = true;
    }      
  }, [categoriesStore, initData]);

    if(!initData.success) {
        return (
            <NetworkError
                ContentSlot={DefaultNetworkErrorContentSlot}
                ActionSlot={() => <DefaultNetworkErrorActionSlot action={router.refresh}/>}
            />
        );
    }
    
    return null;
};

export default InitCategoriesStore;