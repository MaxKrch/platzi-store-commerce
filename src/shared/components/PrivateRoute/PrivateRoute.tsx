"use client";

import Loader from "@components/Loader";
import { META_STATUS } from "@constants/meta-status";
import { useRootStore } from "@providers/RootStoreContext";
import { PropsWithChildren, useEffect } from "react";
import style from './PrivateRouter.module.scss';
import clsx from "clsx";
import { MODES } from "@constants/modal";
import { useRouter } from "next/navigation";
import { appRoutes } from "@constants/app-routes";

const PrivateRoute: React.FC<PropsWithChildren> = ({ children }) => {
    const router = useRouter();
    const { modalStore, userStore } = useRootStore();

    useEffect(() => {
        if(!userStore.isAuthorized && userStore.status !== META_STATUS.PENDING) {
            modalStore.open(MODES.AUTH);
            router.replace(appRoutes.main.create());     
        } 
    }, [router, userStore.isAuthorized, modalStore, userStore.status]);
    

    if(userStore.status === META_STATUS.PENDING) {
        <div className={clsx(style['loading'])}>
            <Loader className={clsx(style['loading__icon'])}/>
        </div>;
    }

    if(!userStore.isAuthorized) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}; 

export default PrivateRoute;