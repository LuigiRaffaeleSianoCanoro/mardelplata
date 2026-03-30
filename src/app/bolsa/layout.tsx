import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolsa de trabajo — MdPDev",
  description:
    "Ofertas laborales y servicios freelance de la comunidad marplatense. Clasificados locales.",
};

export default function BolsaLayout({ children }: { children: React.ReactNode }) {
  return <div className="bolsa-root min-h-screen font-sans antialiased">{children}</div>;
}
