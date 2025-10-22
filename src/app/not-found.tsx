import clsx from "clsx";
import style from './app.module.scss';
import Text from "@components/Text";
import Image from "next/image";
import Button from "@components/Button";
import Link from "next/link";
import { appRoutes } from "@constants/app-routes";

export default function NotFoundPage () {
    return(
        <article className={clsx(style['error'])}>
            <header className={clsx(style['error__header'])}>
                <Text view="title">
                    Кажется, страницу кто-то похитил!
                </Text> 
            </header>
            <main className={clsx(style['error__body'])}>
                <div className={clsx(style['error__image-container'])}>
                    <Image
                        src='/not-found.png'
                        priority
                        sizes="(max-width: 768px) 100vw, 768px" 
                        fill
                        alt='notFound'
                        className={clsx(style['error__image'])}
                    />
                </div>
                <Text className={clsx(style['error__description'])}>
                    Мы уже ищем виновника!
                </Text>
                <Text className={clsx(style['error__description'])}>
                    Хотите что-нибудь выбрать для себя?
                </Text>
            </main>
            <footer className={clsx(style['error__footer'])}>
                <Link href={appRoutes.main.create()}>
                    <Button className={clsx(style['error__button'])}>
                        Да, хочу! 
                    </Button>  
                </Link> 
            </footer>            
        </article>
    );
}

