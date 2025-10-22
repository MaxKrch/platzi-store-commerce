import type { Metadata } from "next";
import { Roboto } from 'next/font/google';
import "@style/main.scss";
import Providers from "./providers";
import Header from "./components/Header";
import clsx from "clsx";
import style from './app.module.scss';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: "Lalasia - онлайн-магазин",
  description: "Тысячи уникальных товаров c доставкой от часа",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className={clsx(style['app'])}>
          <Providers>
            <Header />
            <div id="modal-portal" />
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
