import Text from "@components/Text";
import style from './about.module.scss';
import clsx from "clsx";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "О нас",
  description: "Lalasia - онлайн-магазин бесполезных товаров",
};

export default function AboutPage () {
    return(
        <article className={clsx(style['about'])}>            
            <header className={clsx(style['about__title'])}>
                <Text weight="bold">
                    Добро пожаловать в наш онлайн-магазин!
                </Text>                
            </header>
            <div className={clsx(style['about__image-container'])}>
                    <Image
                        src='/about-us.png'
                        priority
                        sizes="(max-width: 768px) 100vw, 768px" 
                        fill
                        alt='notFound'
                        className={clsx(style['about__image'])}
                    />
                </div>
            <Text  className={clsx(style['about__description'])}>
                В нём вы найдёте всё — от «того, чего нет», до «того, что пока только в коде».
            </Text> 
            <Text className={clsx(style['about__description'])}>
                Возможно, когда-нибудь тут появится настоящий товар (нет...)
            </Text>
            <Text className={clsx(style['about__description'])}>
                Удачных покупок!
            </Text>
        </article>
    );
}

