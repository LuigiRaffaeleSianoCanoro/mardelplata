import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ParallaxProvider from "@/components/ParallaxProvider";

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
  icons: {
    icon: "/mdpdev.png",
    apple: "/mdpdev.png",
  },
  openGraph: {
    title: "MdPDev — Comunidad Dev Mar del Plata",
    description:
      "El Hub Tech de la Costa Atlántica. Conectamos devs, diseñadores y emprendedores en Mar del Plata.",
    type: "website",
    images: ["/mdpdev.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Synchronous intro-splash gate — runs before paint so the splash
            never flashes on revisits or for users with reduced motion. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var k='mdpdev-intro-v3-seen';var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||sessionStorage.getItem(k)==='1'){document.documentElement.classList.add('intro-seen')}else{sessionStorage.setItem(k,'1')}}catch(e){}",
          }}
        />
      </head>
      <body className="bg-white text-slate-800 antialiased">
        <ParallaxProvider />
        {children}
      </body>
    </html>
  );
}
