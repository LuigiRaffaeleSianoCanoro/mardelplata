import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MdPDev — preview · motion",
  description: "Preview de rediseño con foco en animaciones y movimiento.",
};

export default function MotionPreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ocean-900 text-white antialiased overflow-x-hidden">{children}</div>;
}
