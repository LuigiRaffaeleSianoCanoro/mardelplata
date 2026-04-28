"use client";

// Error catastrófico de la raíz — Next renderiza esto cuando incluso el
// layout falla. No tiene acceso a globals.css ni al layout, así que va con
// estilos inline en español plano y a tono con la marca.

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0A0A0F",
          color: "rgba(255,255,255,0.92)",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 480, width: "100%" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              marginBottom: 12,
            }}
          >
            colapso · root layout
          </p>
          <h1
            style={{
              fontSize: 32,
              lineHeight: 1.1,
              fontWeight: 200,
              margin: "0 0 16px",
              letterSpacing: "-0.01em",
            }}
          >
            Se cayó toda la cubierta.
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontWeight: 300,
              margin: "0 0 24px",
              lineHeight: 1.6,
            }}
          >
            Hubo un error tan profundo que ni el layout pudo cargar. Si recargás y persiste,
            escribinos.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 24,
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              ref · {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              color: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(59,130,246,0.45)",
              background: "rgba(59,130,246,0.18)",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
