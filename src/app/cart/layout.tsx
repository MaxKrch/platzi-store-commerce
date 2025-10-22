import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Корзина товаров",
    description: "Оформление в два клика, бесплатная доставка - от часа",
};

export default function CartLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
