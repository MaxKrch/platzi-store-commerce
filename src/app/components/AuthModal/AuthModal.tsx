"use client";

import React, {  useCallback, useRef, useState } from 'react';
import style from './AuthModal.module.scss';
import { useRootStore } from '@providers/RootStoreContext';
import { observer } from 'mobx-react-lite';
import { MODES } from '@constants/modal';
import ModalPortal from '@components/ModalPortal';
import clsx from 'clsx';
import AuthHeader  from './components/AuthHeader/AuthHeader';
import AuthForm from './components/AuthForm/AuthForm';
import { AUTH_MODES, AuthModes } from './constants';
import { Schema } from './AuthModal.schema';

const AuthModal: React.FC = () => {
    const { modalStore, authStore } = useRootStore();
    const [authMode, setAuthMode] = useState<AuthModes>(AUTH_MODES.LOGIN);
    const [error, setError] = useState<string | null>(null);
    const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
 
    const handleSubmit = useCallback(async (data: Schema) => {
        let result: { success: boolean };

        if(authMode === AUTH_MODES.REGISTER) {
            if(!data.login) {
                return;
            }

            result = await authStore.register({
                name: data.login,
                password: data.password,
                email: data.email,
                avatar: 'https://avatar.iran.liara.run/public',
                keepMeLoggedIn: data.saveMe,
            });

        } else {
            result = await authStore.login({
                email: data.email,
                password: data.password,
                keepMeLoggedIn: data.saveMe,
            });
        }

        if(!result.success) {
            if(errorTimer.current) {
                clearTimeout(errorTimer.current);
            }
            setError(authStore.error);
            errorTimer.current = setTimeout(() => setError(null), 3 * 1000);
            
            return;
        }
        
        modalStore.close();
    }, [authStore, modalStore, authMode]);

    const shouldShow = modalStore.isOpen 
        && modalStore.mode === MODES.AUTH 
        && !authStore.isAuthorized; 

    if(!shouldShow) {
        return null;
    }

    return(
        <ModalPortal>
            <div className={clsx(style['auth'])}>
                <AuthHeader mode={authMode} onChange={setAuthMode}/>
                <AuthForm 
                    mode={authMode}
                    onSubmit={handleSubmit} 
                    needReset={!modalStore.isOpen} 
                    error={error} 
                    loading={authStore.isPending}
                />
            </div>
        </ModalPortal>
    );
};

export default observer(AuthModal);