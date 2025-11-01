"use client";

import Loader from "@components/Loader";
import { useRootStore } from "@providers/RootStoreContext";
import { PropsWithChildren, useEffect } from "react";
import style from './PrivateRouter.module.scss';
import clsx from "clsx";
import { MODES } from "@constants/modal";
import { useRouter } from "next/navigation";
import { appRoutes } from "@constants/app-routes";

const PrivateRoute: React.FC<PropsWithChildren> = ({ children }) => {
    const router = useRouter();
    const { modalStore, authStore } = useRootStore();

    useEffect(() => {
        if(!authStore.isAuthorized && !authStore.isPending) {
            modalStore.open(MODES.AUTH);
            router.replace(appRoutes.main.create());     
        } 
    }, [router, authStore.isAuthorized, authStore.isPending, modalStore, authStore.status]);
    

    if(authStore.isPending) {
        <div className={clsx(style['loading'])}>
            <Loader className={clsx(style['loading__icon'])}/>
        </div>;
    }

    if(!authStore.isAuthorized) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}; 

export default PrivateRoute;