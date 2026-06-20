import { ImageResponse } from "next/og";

// OG image dinámica por página (audit S1). Uso: /api/og?title=...&eyebrow=...
// Las páginas la referencian en openGraph.images. Estilo oceánico de marca.

export const runtime = "edge";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "MdPDev").slice(0, 100);
  const eyebrow = (searchParams.get("eyebrow") ?? "El Hub Tech de la Costa Atlántica").slice(0, 80);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #020030 0%, #023E8A 55%, #0096C7 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: 34, fontWeight: 700 }}>
          <span style={{ color: "#48CAE4" }}>&lt;/&gt;</span>
          <span>mardelplata<span style={{ color: "#48CAE4" }}>.dev</span></span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#90E0EF" }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, maxWidth: "950px" }}>
            {title}
          </div>
        </div>

        <div style={{ fontSize: 28, color: "#CAF0F8" }}>
          Mar del Plata · Argentina
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
