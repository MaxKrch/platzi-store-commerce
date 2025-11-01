"use client";

import React, { useCallback, useRef, useState } from 'react';
import style from './UserModal.module.scss';
import { useRootStore } from '@providers/RootStoreContext';
import ModalPortal from '@components/ModalPortal';
import { MODES } from '@constants/modal';
import { observer } from 'mobx-react-lite';
import Button from '@components/Button';
import clsx from 'clsx';
import Text from '@components/Text';
import Image from 'next/image';
import Loader from '@components/Loader';


const UserModal: React.FC = () => {
    const { modalStore, authStore } = useRootStore();
    const [error, setError] = useState<string | null>(null);
    const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleLogout = useCallback(async () => {
        setError(null);
        const result = await authStore.logout();
        
        if(!result.success) {
            if(errorTimer.current) {
                clearTimeout(errorTimer.current);
            }
            setError(authStore.error);
            errorTimer.current = setTimeout(() => setError(null), 3 * 1000);
            return;
        }

        modalStore.close();
    }, [modalStore, authStore]);

    const shouldShow = modalStore.isOpen 
        && modalStore.mode === MODES.PROFILE 
        && authStore.isAuthorized; 
   
    if(!shouldShow) {
        return null;
    }

    return(
        <ModalPortal>
            <div className={clsx(style['user-modal'])}>
                <div className={clsx(style['user-modal__image-wrapper'])}>
                    <Image 
                        className={clsx(style['user-modal__image'])}
                        src="/avatar.png"
                        alt="Default avatar"
                        fill
                        priority
                        sizes='300px'
                    />
                </div>
                <div className={clsx(style['user-modal__info'])}>
                    <div className={clsx(style['user-modal__section'])}>
                        <Text className={clsx(style['user-modal__section-title'])} weight='bold'>
                            Логин: 
                        </Text>
                        <Text className={clsx(style['user-modal__section-value'])}>
                            {authStore.user?.name}
                        </Text>
                    </div>
                    <div className={clsx(style['user-modal__section'])}>
                        <Text className={clsx(style['user-modal__section-title'])} weight='bold'>
                            Email: 
                        </Text>
                        <Text className={clsx(style['user-modal__section-value'])}>
                            {authStore.user?.email}
                        </Text>
                    </div>    
                    <div className={clsx(style['user-modal__section'])}>
                        <Text className={clsx(style['user-modal__section-title'])} weight='bold'>
                            Регистрация: 
                        </Text>
                    </div>
                </div>
                <div className={clsx(style['user-modal__error'])}>
                    {error}
                </div>                
                <div className={clsx(style['user-modal__action'])}>
                    <Button onClick={handleLogout} loading={authStore.isPending} className={clsx(style['user-modal__button'])}>
                        {authStore.isPending && 
                            <Loader size='s' className={clsx(style['user-modal__action-icon'])}/>
                        }
                        Выйти
                    </Button>            
                </div>
    
            </div>
        </ModalPortal> 
    );
}; 

export default observer(UserModal)


















































;