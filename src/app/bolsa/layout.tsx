import type { Metadata } from "next";
import { Lora } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-bolsa-serif",
});

export const metadata: Metadata = {
  title: "Bolsa de trabajo — MdPDev",
  description:
    "Ofertas laborales y servicios freelance de la comunidad marplatense. Clasificados locales.",
};

export default function BolsaLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${lora.variable} bolsa-root min-h-screen`}>{children}</div>;
}
