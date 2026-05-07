import type { Metadata } from "next";
import { Inter, Space_Grotesk, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import RouteGlitch from "@/components/RouteGlitch";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Fraunces — serif variable con eje SOFT y OPTL. Le da gravitas
// editorial / nautica a los titulares y rompe del tropo "tech sans"
// genérico. Lo usamos como display principal en la home.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

// JetBrains Mono explícito — reemplaza el ui-monospace fallback en
// los chrome HUD para tener métrica consistente.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Synchronous intro-splash gate — runs before paint so the splash
            never flashes on revisits or for users with reduced motion. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var k='mdpdev-intro-v5-seen';var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;var c=navigator.connection||{};var lo=c.saveData||c.effectiveType==='slow-2g'||c.effectiveType==='2g';if(r||lo||localStorage.getItem(k)==='1'){document.documentElement.classList.add('intro-seen')}else{localStorage.setItem(k,'1')}}catch(e){}",
          }}
        />
      </head>
      <body className="bg-[#06070d] text-white/85 antialiased">
        <RouteGlitch />
        {children}
      </body>
    </html>
  );
}
