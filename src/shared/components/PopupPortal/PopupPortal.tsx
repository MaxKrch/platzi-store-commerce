"use client";

import { useRootStore } from "@providers/RootStoreContext";
import { PopupItem } from "@store/global/PopupStore/PopupStore";
import { observer } from "mobx-react-lite";
import { PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import style from './PopupPortal.module.scss';
import clsx from "clsx";
import calculatePosition from "./utils/calculate-position";

export type PopupPortalProps = PropsWithChildren<{
    type: PopupItem['type'];     
    anchorEl: HTMLElement | null;
    container?: HTMLElement | null; 
    className?: string;
}>

const isElement = (target: EventTarget | null): target is Element => {
    return target instanceof Element;
};

const PopupPortal: React.FC<PopupPortalProps> = ({ 
    children, 
    type,
    anchorEl, 
    className, 
    container 
}) => {
    const [portal, setPortal] = useState<HTMLElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const { popupStore } = useRootStore();
    const popup = popupStore.getPopupByType(type);

    const handleClick = useCallback((event: PointerEvent) => {
          if(!isElement(event.target)) {
            return;
        } 

        if(popup && popup.closeOnOutsideClick && !event.target.closest("[data-id='popupContainer']")) {
            popupStore.removePopupByType(type);    
        }

    }, [popup, popupStore, type]);

    const reCalculationPosition = useCallback(() => {
        if(!anchorEl || !popupRef.current) {
            return;
        }

        requestAnimationFrame(() => {
            if(!anchorEl || !popupRef.current) {
                return;
            }
            const position = calculatePosition({
                anchor: anchorEl, 
                popup: popupRef.current,
                container: container
            });
            
            Object.assign(popupRef.current.style, {
                top: `${position.top}px`,
                left: `${position.left}px`,
                height: `${position.height}px`,
                width: `${position.width}px`, 
            });            
        });
    }, [anchorEl, container]);

    useLayoutEffect(() => {
        setPortal(document.getElementById('popup-portal'));
    }, []);

    useEffect(() => {
        reCalculationPosition();
    }, [portal, anchorEl, reCalculationPosition, popup]);

    useEffect(() => {
        document.addEventListener('pointerup', handleClick);
        return () => document.removeEventListener('pointerup', handleClick);
    }, [handleClick]);

    useEffect(() => {
        window.addEventListener('resize', reCalculationPosition);
        return () => window.removeEventListener('resize', reCalculationPosition);
    }, [reCalculationPosition]);

    useEffect(() => {
        window.addEventListener('scroll', reCalculationPosition);
        return () => window.removeEventListener('scroll', reCalculationPosition);
    }, [reCalculationPosition]);

    useEffect(() => {
        if(!anchorEl && !popupRef.current) {
            return;
        }

        const observer = new ResizeObserver(reCalculationPosition);
        
        if(anchorEl) {
            observer.observe(anchorEl); 
        }

        if(popupRef.current) {
            observer.observe(popupRef.current);
        }

        return () => observer.disconnect();
    }, [anchorEl, reCalculationPosition]);


    if(!popup || !portal) {
        return null;
    }

    return createPortal(
        <div 
            className={clsx(style['popup'], className)}
            data-id='popupContainer'
            ref={popupRef}
        >
            {children}
        </div>,
        portal
    );
};

export default observer(PopupPortal);