"use client";

import OnlyClient from "@components/OnlyClient";
import clsx from "clsx";
import style from './ModalPortal.module.scss';
import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CrossIcon from "@components/icons/CrossIcon";
import { useRootStore } from "@providers/RootStoreContext";

const isElement = (target: EventTarget | null): target is Element => {
  return target instanceof Element;
};

export type ModalPortalProps = PropsWithChildren<{
    size?: 'modal' | 'full',
    onClose?: () => void
}>

const ModalPortal: React.FC<ModalPortalProps> = ({ children, size = 'modal', onClose }) => {
    const [portal, setPortal] = useState<HTMLElement | null>(null);
    const { modalStore } = useRootStore();


    const handleClick = useCallback((event: MouseEvent) => {
        if(!modalStore.isOpen) {
            return;
        }

        if(!isElement(event.target)) {
            return;
        }

        const isModalContainer = event.target.closest('[data-id="modal-container"]')
            && !event.target.closest('[data-id="modal-close"]');

        if(isModalContainer) {
            return;
        }
      
        modalStore.close();
        document.removeEventListener('pointerdown', handleClick);
        if(onClose) {
            onClose();
        }
    }, [onClose, modalStore]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if(event.key !== "Escape") {
            return;
        }

        modalStore.close();
        window.removeEventListener('keydown', handleKeyDown);

        if(onClose) {
            onClose();
        }
    }, [modalStore, onClose]);

    useEffect(() => { 
        setPortal(document.getElementById('modal-portal'));
    }, []);

    useEffect(() => {
        if(!modalStore.isOpen) {
            return;
        }
        document.addEventListener('pointerdown', handleClick);
        return () => removeEventListener('pointerdown', handleClick);
    }, [handleClick, modalStore.isOpen]);

    useEffect(() => {
        if(!modalStore.isOpen) {
            return;
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleClick, modalStore.isOpen, handleKeyDown]);

    if(!portal) {
        return null;
    }

    return createPortal(
        <OnlyClient>
            <aside className={clsx(style['modal'])}>
                <div data-id="modal-container" className={clsx(style['modal__container'], style[`modal__container_${size}`])}>
                    <div role='button' data-id="modal-close" className={clsx(style['modal__close-icon-wrapper'])}>
                        <CrossIcon className={clsx(style['modal__close-icon'])}/>
                    </div>
                    <div className={clsx(style['modal__content'])}>
                        {children}
                    </div>
                </div>
            </aside>
        </OnlyClient>,
        portal
    );
};

export default ModalPortal;