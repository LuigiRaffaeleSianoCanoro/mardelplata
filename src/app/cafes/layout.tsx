import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cafés para nómades — mardelplata.dev.ar",
  description:
    "Recomendaciones de cafés de Mar del Plata aptos para trabajo remoto: WiFi, enchufes, mesas y ambiente, votados por la comunidad.",
};

export default function CafesLayout({ children }: { children: React.ReactNode }) {
  return <div className="cafes-root min-h-screen font-sans antialiased">{children}</div>;
}
