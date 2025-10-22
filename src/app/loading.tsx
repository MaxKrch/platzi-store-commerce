

import Loader from "@components/Loader";
import clsx from "clsx";
import style from './app.module.scss';

export default function Loading () {
    return (
        <div className={clsx(style['loading'])}>
            <Loader className={clsx(style['loading__icon'])}/>
        </div>
    );
}