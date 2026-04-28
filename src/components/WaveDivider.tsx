import LowPolyWave from "./LowPolyWave";

type Tone = "light-to-tint" | "tint-to-light" | "light-to-dark" | "dark-to-light";

interface WaveDividerProps {
  tone?: Tone;
  height?: number;
  flip?: boolean;
}

const TONE_PALETTES: Record<
  Tone,
  {
    bg: string;
    layers: { stroke: string; fill: string }[];
  }
> = {
  "light-to-tint": {
    bg: "bg-white",
    layers: [
      { stroke: "rgba(59, 130, 246, 0.30)", fill: "rgba(59, 130, 246, 0.05)" },
      { stroke: "rgba(0, 119, 182, 0.40)",  fill: "rgba(0, 119, 182, 0.08)" },
      { stroke: "rgba(2, 62, 138, 0.55)",   fill: "rgba(202, 240, 248, 0.95)" },
    ],
  },
  "tint-to-light": {
    bg: "[background:linear-gradient(180deg,#eaf6fb_0%,#f7fcfe_100%)]",
    layers: [
      { stroke: "rgba(59, 130, 246, 0.25)", fill: "rgba(59, 130, 246, 0.04)" },
      { stroke: "rgba(0, 119, 182, 0.35)",  fill: "rgba(0, 119, 182, 0.06)" },
      { stroke: "rgba(2, 62, 138, 0.45)",   fill: "rgba(255, 255, 255, 1)" },
    ],
  },
  "light-to-dark": {
    bg: "bg-white",
    layers: [
      { stroke: "rgba(59, 130, 246, 0.55)", fill: "rgba(2, 62, 138, 0.35)" },
      { stroke: "rgba(59, 130, 246, 0.65)", fill: "rgba(2, 4, 30, 0.7)" },
      { stroke: "rgba(255, 255, 255, 0.25)", fill: "rgba(10, 10, 15, 1)" },
    ],
  },
  "dark-to-light": {
    bg: "bg-[#0A0A0F]",
    layers: [
      { stroke: "rgba(59, 130, 246, 0.55)", fill: "rgba(2, 62, 138, 0.55)" },
      { stroke: "rgba(0, 119, 182, 0.65)",  fill: "rgba(0, 150, 199, 0.75)" },
      { stroke: "rgba(255, 255, 255, 0.45)", fill: "rgba(255, 255, 255, 1)" },
    ],
  },
};

const DRIFTS = ["wave-layer-deep", "wave-layer-mid", "wave-layer-fore"] as const;
const BOBS = ["boat-bob-deep-1", "boat-bob-deep-2", "boat-bob-deep-3"] as const;

const LAYER_PARAMS = [
  { rows: 3, cols: 40, amp: 6,  phaseRatio: 0.30, crests: 3, foam: false },
  { rows: 3, cols: 30, amp: 10, phaseRatio: 0.50, crests: 3, foam: false },
  { rows: 2, cols: 22, amp: 14, phaseRatio: 0.70, crests: 3, foam: true  },
];

export default function WaveDivider({
  tone = "light-to-tint",
  height = 110,
  flip = false,
}: WaveDividerProps) {
  const palette = TONE_PALETTES[tone];

  return (
    <div
      className={`relative w-full overflow-hidden ${palette.bg} ${flip ? "scale-y-[-1]" : ""}`}
      style={{ height }}
      aria-hidden="true"
    >
      {palette.layers.map((layer, i) => {
        const params = LAYER_PARAMS[i];
        return (
          <div key={i} className={`absolute inset-0 ${BOBS[i]}`}>
            <LowPolyWave
              className={DRIFTS[i]}
              stroke={layer.stroke}
              fill={layer.fill}
              rows={params.rows}
              cols={params.cols}
              amp={params.amp}
              baseY={Math.round(height * params.phaseRatio)}
              phase={i * 1.2}
              crests={params.crests}
              height={height}
              foam={params.foam}
              foamColor={tone === "dark-to-light" || tone === "light-to-dark" ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.7)"}
            />
          </div>
        );
      })}
    </div>
  );
}
