import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Fraunces, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import RouteGlitch from "@/components/RouteGlitch";
import JsonLd from "@/components/seo/JsonLd";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { organizationSchema, webSiteSchema } from "@/lib/seo/jsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { THEME_BOOT_SCRIPT } from "@/lib/v3/theme-boot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  // v3: la home usa Geist; estas quedan para las subpáginas sin precargar.
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  // v3: la home usa Geist; estas quedan para las subpáginas sin precargar.
  preload: false,
});

// Fraunces — serif variable con eje SOFT y OPTL. Le da gravitas
// editorial / nautica a los titulares y rompe del tropo "tech sans"
// genérico. Lo usamos como display principal en la home.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  // v3: la home usa Geist; estas quedan para las subpáginas sin precargar.
  preload: false,
  axes: ["SOFT", "WONK", "opsz"],
});

// JetBrains Mono explícito — reemplaza el ui-monospace fallback en
// los chrome HUD para tener métrica consistente.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  // v3: la home usa Geist; estas quedan para las subpáginas sin precargar.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Comunidad dev de Mar del Plata`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} — Comunidad dev de Mar del Plata`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/api/og?title=El%20Club%20Tech%20de%20Mar%20del%20Plata",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Comunidad dev de Mar del Plata`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Comunidad dev de Mar del Plata`,
    description: SITE_DESCRIPTION,
    images: ["/api/og?title=El%20Club%20Tech%20de%20Mar%20del%20Plata"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${fraunces.variable} ${jetbrainsMono.variable} ${GeistSans.variable} ${GeistMono.variable}`}
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
              "try{document.documentElement.classList.add('intro-seen','assets-ready');}catch(e){}" +
              THEME_BOOT_SCRIPT,
          }}
        />
      </head>
      <body className="bg-[#06070d] text-white/85 antialiased">
        <JsonLd schema={[organizationSchema(), webSiteSchema()]} />
        <GoogleAnalytics />
        <RouteGlitch />
        {children}
      </body>
    </html>
  );
}
