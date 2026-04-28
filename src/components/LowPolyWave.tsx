// Low-poly triangulated wave — server-renderable mesh. Looped seamlessly when
// rendered inside an element with `width: 200%` and the wave-slow drift class
// (the wave function repeats at x = 1440, so a -50% translate is invisible).

interface LowPolyWaveProps {
  /** Triangle stroke color (rgba). */
  stroke: string;
  /** Triangle fill color (rgba). Use very low alpha for "wireframe" feel. */
  fill: string;
  /** Vertical rows of triangles below the crest. More rows → deeper mesh. */
  rows?: number;
  /** Horizontal subdivisions across the 2880px span. */
  cols?: number;
  /** Crest amplitude in px. */
  amp?: number;
  /** Y position of the wave crest baseline (within the SVG viewBox). */
  baseY?: number;
  /** Phase offset to differentiate stacked layers. */
  phase?: number;
  /** Number of crest cycles across the full 2880 width (must be even). */
  crests?: number;
  /** Total SVG height. */
  height?: number;
  /** Render foam dots on the wave crest (small white circles). */
  foam?: boolean;
  /** Foam dot color. */
  foamColor?: string;
  className?: string;
}

export default function LowPolyWave({
  stroke,
  fill,
  rows = 3,
  cols = 32,
  amp = 18,
  baseY = 110,
  phase = 0,
  crests = 4,
  height = 220,
  foam = false,
  foamColor = "rgba(255, 255, 255, 0.85)",
  className,
}: LowPolyWaveProps) {
  const W = 2880;
  const colW = W / cols;
  const remaining = Math.max(0, height - baseY);
  const rowH = rows > 0 ? remaining / rows : 0;

  // Build vertex grid. Top row carries the sine wave; lower rows fade out.
  const grid: { x: number; y: number }[][] = [];
  for (let r = 0; r <= rows; r++) {
    const row: { x: number; y: number }[] = [];
    const fade = rows > 0 ? 1 - r / rows : 1;
    for (let c = 0; c <= cols; c++) {
      const x = c * colW;
      const wave = Math.sin((c / cols) * Math.PI * 2 * crests + phase) * amp * fade;
      const y = baseY + r * rowH + wave;
      row.push({ x, y });
    }
    grid.push(row);
  }

  // Triangulate (alternate diagonal direction for organic look)
  const triangles: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = grid[r][c];
      const b = grid[r][c + 1];
      const cc = grid[r + 1][c];
      const d = grid[r + 1][c + 1];
      const flip = (r + c) % 2 === 0;
      if (flip) {
        triangles.push(`${a.x},${a.y} ${b.x},${b.y} ${cc.x},${cc.y}`);
        triangles.push(`${b.x},${b.y} ${d.x},${d.y} ${cc.x},${cc.y}`);
      } else {
        triangles.push(`${a.x},${a.y} ${b.x},${b.y} ${d.x},${d.y}`);
        triangles.push(`${a.x},${a.y} ${d.x},${d.y} ${cc.x},${cc.y}`);
      }
    }
  }

  // Bottom strip — solid fill from the lowest mesh row down to the SVG floor,
  // so the mesh "sits" on a flat band that hides whatever's behind.
  const bottomY = baseY + rows * rowH;
  const baseStrip = `M0,${bottomY} L${W},${bottomY} L${W},${height} L0,${height} Z`;

  return (
    <div
      className={`absolute inset-x-0 bottom-0 ${className || ""}`}
      style={{ width: "200%", height }}
    >
      <svg
        viewBox={`0 0 ${W} ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <path d={baseStrip} fill={fill} />
        <g
          fill={fill}
          stroke={stroke}
          strokeWidth="0.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {triangles.map((pts, i) => (
            <polygon key={i} points={pts} />
          ))}
        </g>
        {foam && (
          <g fill={foamColor}>
            {grid[0].map((v, i) => {
              const wave = Math.sin((i / cols) * Math.PI * 2 * crests + phase);
              if (wave < 0.55) return null;
              const r = 0.9 + wave * 1.6;
              return <circle key={i} cx={v.x} cy={v.y - 1.5} r={r} />;
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
