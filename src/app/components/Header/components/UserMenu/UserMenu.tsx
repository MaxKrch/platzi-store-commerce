import { appRoutes } from "@constants/app-routes";
import { useRootStore } from "@providers/RootStoreContext";
import { POPUP_TYPES } from "@store/global/PopupStore/PopupStore";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { MouseEvent, useCallback, useLayoutEffect, useRef } from "react";
import style from './UserMenu.module.scss';
import clsx from "clsx";
import PopupPortal from "@components/PopupPortal";

export type UserMenuProps = {
    anchorEl: HTMLElement | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ anchorEl }) => {
    const { authStore, popupStore } = useRootStore();
    const containerEl = useRef<HTMLElement | null>(null);
    const handleMenuClick = useCallback((event: MouseEvent<HTMLUListElement>) => {
        event.stopPropagation();
        popupStore.removePopupByType(POPUP_TYPES.USER_MENU);
    }, [popupStore]);

    useLayoutEffect(() => {
        containerEl.current = document.getElementById('app');
    }, [popupStore]);

    return(
        <PopupPortal
            type={POPUP_TYPES.USER_MENU}
            anchorEl={anchorEl}
            className={clsx(style['menu__wrapper'])}
            container={containerEl.current}
        >
            <ul className={clsx(style['menu'])} onClick={handleMenuClick}>
                <li className={clsx(style['menu-link__wrapper'])}>
                    <Link className={clsx(style['menu-link'])} href={appRoutes.my.create()}>
                        Мой профиль
                    </Link>
                </li>
                <li className={clsx(style['menu-link__wrapper'])}>
                    <button className={clsx(style['menu-link'])} onClick={authStore.logout}>
                    Выйти
                    </button>
                </li>
            </ul>
        </PopupPortal>
    );
};

export default observer(UserMenu);