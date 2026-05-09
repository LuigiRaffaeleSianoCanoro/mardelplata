// SectionWaveMesh — decoración low-poly con el degrade violeta→azul de
// la intro. Pensado para meterse como bg layer en las hud-sections para
// mantener el "tema mar" en toda la home. Estático (no anima), opacidad
// baja, mask radial para que se desvanezca en los bordes.
//
// Variantes:
//   - "horizon" (default): fan de triángulos creciendo desde abajo
//     simulando la ola low-poly del IntroSplashWaves.
//   - "scatter": triángulos esparcidos por todo el viewport, como
//     "constelación" de polígonos de boot.
//
// Cada uso del componente debe tener un `id` único para el gradient (los
// SVGs comparten DOM y los `url(#id)` se resuelven a la primera coincidencia).

interface SectionWaveMeshProps {
  variant?: "horizon" | "scatter";
  id?: string;
  className?: string;
  opacity?: number;
}

export default function SectionWaveMesh({
  variant = "horizon",
  id = "section-mesh-grad",
  className = "",
  opacity = 0.18,
}: SectionWaveMeshProps) {
  return (
    <svg
      className={`section-wave-mesh ${className}`}
      viewBox="0 0 1000 600"
      preserveAspectRatio={variant === "horizon" ? "xMidYMax slice" : "xMidYMid slice"}
      aria-hidden
      style={{ opacity }}
    >
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={variant === "horizon" ? "150" : "0"}
          x2="1000"
          y2="600"
        >
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="35%" stopColor="#6366f1" />
          <stop offset="65%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
      </defs>

      {variant === "horizon" ? (
        <HorizonMesh gradId={id} />
      ) : (
        <ScatterMesh gradId={id} />
      )}
    </svg>
  );
}

// Malla tipo "ola" — filas debajo de un horizonte sutil, como la del
// LowPolyDissolveIntro pero sin animación.
function HorizonMesh({ gradId }: { gradId: string }) {
  const COLS = 14;
  const ROWS = 6;
  const W = 1000;
  const H = 600;
  const horY = H * 0.32;
  const colW = W / COLS;

  // Generar grilla determinística de vértices (con jitter por seed).
  const seeded = (i: number, salt = 1) => {
    const x = Math.sin(i * 9301.0 + salt * 49297.0) * 233280.0;
    return x - Math.floor(x);
  };

  const verts: { x: number; y: number }[][] = [];
  for (let r = 0; r <= ROWS; r++) {
    const row: { x: number; y: number }[] = [];
    const tDepth = r / ROWS;
    const baseY = horY + Math.pow(tDepth, 1.55) * (H * 0.65);
    const ampD = 6 + Math.pow(tDepth, 1.6) * 28;
    for (let c = 0; c <= COLS; c++) {
      const xN = c / COLS;
      const xJ =
        c === 0 || c === COLS ? 0 : (seeded(r * 131 + c, 3) - 0.5) * colW * 0.2;
      const yJ = (seeded(r * 211 + c, 7) - 0.5) * 4;
      const wave =
        Math.sin(xN * Math.PI * 2.4 + r * 0.22) * ampD +
        Math.sin(xN * Math.PI * 5.6 + r * 0.7) * ampD * 0.18 * tDepth;
      row.push({ x: c * colW + xJ, y: baseY + wave + yJ });
    }
    verts.push(row);
  }

  // Triángulos
  const tris: { a: number; b: number; c: number; key: string }[] = [];
  const idx = (r: number, c: number) => r * (COLS + 1) + c;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const a = idx(r, c);
      const b = idx(r, c + 1);
      const cc = idx(r + 1, c);
      const d = idx(r + 1, c + 1);
      const flip = (r + c) % 2 === 0;
      if (flip) {
        tris.push({ a, b, c: cc, key: `${r}-${c}-1` });
        tris.push({ a: b, b: d, c: cc, key: `${r}-${c}-2` });
      } else {
        tris.push({ a, b, c: d, key: `${r}-${c}-1` });
        tris.push({ a, b: d, c: cc, key: `${r}-${c}-2` });
      }
    }
  }

  const flat = verts.flat();

  return (
    <>
      {/* Línea de horizonte sutil */}
      <line
        x1={0}
        y1={horY}
        x2={W}
        y2={horY}
        stroke={`url(#${gradId})`}
        strokeWidth={0.6}
        strokeOpacity={0.4}
      />
      {/* Triángulos */}
      <g
        fill="transparent"
        stroke={`url(#${gradId})`}
        strokeWidth={0.7}
        strokeLinejoin="round"
      >
        {tris.map((t) => {
          const va = flat[t.a];
          const vb = flat[t.b];
          const vc = flat[t.c];
          return (
            <polygon
              key={t.key}
              points={`${va.x},${va.y} ${vb.x},${vb.y} ${vc.x},${vc.y}`}
            />
          );
        })}
      </g>
    </>
  );
}

// Malla "scatter" — triángulos esparcidos para usar como bg full-section
// (sin sensación de horizonte).
function ScatterMesh({ gradId }: { gradId: string }) {
  const seeded = (i: number, salt = 1) => {
    const x = Math.sin(i * 9301.0 + salt * 49297.0) * 233280.0;
    return x - Math.floor(x);
  };

  const tris: { points: string; key: string }[] = [];
  const W = 1000;
  const H = 600;
  // 14 triángulos esparcidos
  for (let i = 0; i < 14; i++) {
    const cx = seeded(i, 11) * W;
    const cy = seeded(i, 23) * H;
    const size = 60 + seeded(i, 37) * 80;
    const rot = seeded(i, 53) * Math.PI * 2;
    const points = [0, 1, 2]
      .map((k) => {
        const angle = rot + (k * Math.PI * 2) / 3;
        return `${(cx + Math.cos(angle) * size).toFixed(1)},${(
          cy +
          Math.sin(angle) * size
        ).toFixed(1)}`;
      })
      .join(" ");
    tris.push({ points, key: `s-${i}` });
  }

  return (
    <g
      fill="transparent"
      stroke={`url(#${gradId})`}
      strokeWidth={0.8}
      strokeLinejoin="round"
    >
      {tris.map((t) => (
        <polygon key={t.key} points={t.points} />
      ))}
    </g>
  );
}
