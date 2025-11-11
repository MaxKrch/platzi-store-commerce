"use client";

import { observer } from "mobx-react-lite";
import style from './MyPage.module.scss';
import clsx from "clsx";
import Image from "next/image";
import { useRootStore } from "@providers/RootStoreContext";
import Button from "@components/Button";
import Loader from "@components/Loader";
import Email from "./components/Email";
import Name from "./components/Name";
import Password from "./components/Password";
import { useCallback } from "react";
import { appRoutes } from "@constants/app-routes";
import { useRouter } from "next/navigation";
import OnlyClient from "@components/OnlyClient";
import PrivateRoute from "@components/PrivateRoute";

const MyPage: React.FC = () => {
    const { authStore, userStore, modalStore, pathStore } = useRootStore();
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        if(authStore.isPending || userStore.isUpdatingUser) {
            return;
        }

        const result = await authStore.logout();
        if(result.success) {
            modalStore.close();
            pathStore.updateURL(router, appRoutes.main.create());
        }
    }, [authStore, modalStore, pathStore, router, userStore.isUpdatingUser]);
   
    return(
        <PrivateRoute>
            <article className={clsx(style['my'])}>
                <section className={clsx(style['my-image__wrapper'])}>
                    <Image 
                        className={clsx(style['my-image'])}
                        src={userStore.user?.avatar ?? './avatar.png'}
                        alt="Default avatar"
                        fill
                        priority
                        sizes='600px'
                    />
                </section>

                <section className={clsx(style['my-info'])}>
                <Email />
                <Password />
                <Name />
                </section>
                
                <section className={clsx(style['my-action'])}>
                    <div className={clsx(style['my-action__error'])}>
                        {authStore.error}
                    </div>
                    <OnlyClient>
                        <Button onClick={handleLogout} loading={authStore.isPending || userStore.isUpdatingUser} className={clsx(style['my-action__button'])}>
                            {authStore.isPending && 
                                <Loader size='s' className={clsx(style['my-action__icon'])}/>
                            }
                            Выйти
                        </Button> 
                    </OnlyClient>         
                </section>
            </article>
        </PrivateRoute>
    );
};

export default observer(MyPage);