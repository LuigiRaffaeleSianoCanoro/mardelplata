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
        {/* Intro splash desactivada momentáneamente: las imagenes de la
            home cargan progresivamente via Next/Image, no hay gate.
            Setamos intro-seen + assets-ready en el documentElement
            para que las reglas CSS que pausan animaciones (.page-after-intro,
            .intro-splash--ext, etc.) pasen directamente.
            Cuando IntroSplashWaves vuelva, sacar este script y restaurar
            el gate original. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.classList.add('intro-seen','assets-ready');}catch(e){}",
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
