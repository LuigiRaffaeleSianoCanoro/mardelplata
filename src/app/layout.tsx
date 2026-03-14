import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "MdPDev — Comunidad Dev Mar del Plata",
  description:
    "El Hub Tech de la Costa Atlántica. Conectamos desarrolladores, diseñadores y emprendedores en Mar del Plata.",
  openGraph: {
    title: "MdPDev — Comunidad Dev Mar del Plata",
    description:
      "El Hub Tech de la Costa Atlántica. Conectamos devs, diseñadores y emprendedores en Mar del Plata.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-white text-slate-800 antialiased">{children}</body>
    </html>
  );
}
