"use client";

import clsx from "clsx";
import style from './app.module.scss';
import Text from "@components/Text";
import Image from "next/image";
import Button from "@components/Button";
import Link from "next/link";
import { appRoutes } from "@constants/app-routes";

export default function ErrorPage ({ reset }: { reset: () => void }) {
    return(
        <article className={clsx(style['error'])}>
            <header className={clsx(style['error__header'])}>
                <Text view="title">
                    Что-то пошло не так...
                </Text> 
            </header>
            <main className={clsx(style['error__body'])}>
                <div className={clsx(style['error__image-container'])}>
                    <Image
                        src='/error.png'
                        priority
                        sizes="(max-width: 768px) 100vw, 768px" 
                        fill
                        alt='notFound'
                        className={clsx(style['error__image'])}
                    />
                </div>
                <Text className={clsx(style['error__description'])}>
                    Мы уже спешим все исправить! 
                </Text>
                <Text className={clsx(style['error__description'])}>
                    Хотите обновить страницу или перейти на главную?
                </Text>
            </main>
            <footer className={clsx(style['error__footer'])}>
                <Button
                    onClick={reset} 
                    className={clsx(style['error__button'])}
                >
                    Обновить  
                </Button>
                <Button 
                    priority="secondary" 
                    className={clsx(style['error__button'])}
                >
                    <Link href={appRoutes.main.create()}>
                        На главную
                    </Link>
                </Button>
            </footer>            
        </article>
    );
}