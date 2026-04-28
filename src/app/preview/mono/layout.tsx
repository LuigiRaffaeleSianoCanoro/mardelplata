import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MdPDev — preview · mono",
  description: "Preview de rediseño en estética mono / Vercel / Basehub.",
};

export default function MonoPreviewLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#09090B] text-zinc-200 antialiased">{children}</div>;
}
