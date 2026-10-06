import { ImageResponse } from "next/og";

// OG image dinámica por página (audit S1). Uso: /api/og?title=...&eyebrow=...
// v3 «Piedra & Código»: fondo #0a0a0a, lobo marino de la Rambla, Geist-like.

export const runtime = "edge";

const RAMBLA =
  "M 2.60 47.60 C 4.00 46.40 6.00 46.80 7.60 48.00 C 9.20 49.20 10.60 50.40 12.60 50.80 C 18.20 49.60 22.80 46.40 26.20 42.00 C 30.20 36.80 31.60 31.20 32.20 26.00 C 33.00 18.00 38.00 12.60 44.60 12.40 C 48.20 12.30 50.80 13.40 52.60 14.80 C 54.20 14.00 56.20 13.40 57.80 14.00 C 59.60 14.80 59.60 17.80 57.80 18.80 C 55.40 20.20 52.40 20.80 49.80 22.60 C 46.60 26.40 46.00 31.60 47.80 36.60 C 49.60 41.40 49.40 46.00 48.00 48.60 C 51.00 49.60 54.20 50.80 56.80 52.60 C 58.80 53.30 58.40 55.00 56.60 55.00 L 14.60 55.00 C 9.60 55.00 5.40 52.60 3.00 49.80 C 2.40 49.10 2.20 48.20 2.60 47.60 Z M43.00 17.60 a2.20 2.20 0 1 0 4.40 0 a2.20 2.20 0 1 0 -4.40 0 Z";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Programamos con viento de costado.").slice(0, 100);
  const eyebrow = (searchParams.get("eyebrow") ?? "Comunidad dev · Mar del Plata").slice(0, 80);
  const mark = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#ededed" fill-rule="evenodd" d="${RAMBLA}"/></svg>`,
  )}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0a0a",
          color: "#ededed",
          fontFamily: "sans-serif",
          borderBottom: "8px solid #ff5c26",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 38, fontWeight: 700, letterSpacing: "-1px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={56} height={56} alt="" />
          <span style={{ display: "flex" }}>
            mardelplata<span style={{ color: "#a1a1a1", fontWeight: 400 }}>.dev.ar</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: "#a1a1a1", fontFamily: "monospace" }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 0.95, letterSpacing: "-4px", maxWidth: "1000px" }}>
            {title}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#a1a1a1", fontFamily: "monospace" }}>
          <span>[MDQ] 38°00′S 57°33′W</span>
          <span>~700 personas</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
