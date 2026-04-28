type Tone = "light-to-tint" | "tint-to-light" | "light-to-dark" | "dark-to-light";

interface WaveDividerProps {
  tone?: Tone;
  height?: number;
  flip?: boolean;
}

const TONE_PALETTES: Record<Tone, { bg: string; layers: [string, string, string] }> = {
  "light-to-tint": {
    bg: "bg-white",
    layers: ["rgba(0, 119, 182, 0.10)", "rgba(0, 150, 199, 0.18)", "rgba(202, 240, 248, 0.95)"],
  },
  "tint-to-light": {
    bg: "[background:linear-gradient(180deg,#eaf6fb_0%,#f7fcfe_100%)]",
    layers: ["rgba(0, 119, 182, 0.08)", "rgba(0, 150, 199, 0.14)", "rgba(255, 255, 255, 1)"],
  },
  "light-to-dark": {
    bg: "bg-white",
    layers: ["rgba(0, 119, 182, 0.4)", "rgba(2, 62, 138, 0.7)", "rgba(2, 0, 48, 1)"],
  },
  "dark-to-light": {
    bg: "bg-ocean-900",
    layers: ["rgba(0, 119, 182, 0.55)", "rgba(0, 150, 199, 0.75)", "rgba(255, 255, 255, 1)"],
  },
};

const PATHS = [
  // Deep — slowest, gentlest amplitude
  "M0,80 C360,110 720,40 1080,80 C1440,120 1800,30 2160,80 C2520,130 2880,40 2880,80 L2880,160 L0,160 Z",
  // Mid — medium amplitude
  "M0,90 C480,40 960,140 1440,80 C1920,30 2400,130 2880,90 L2880,160 L0,160 Z",
  // Fore — sharpest, fastest
  "M0,110 C240,80 600,140 1080,100 C1560,60 1920,140 2400,100 C2640,80 2880,120 2880,110 L2880,110 L0,110 Z",
];

// Each layer has horizontal drift (outer) + vertical bob (inner) so waves
// rise and fall while drifting. Different drift speeds and bob phases give
// a parallax-like depth.
const DRIFTS = ["wave-layer-deep", "wave-layer-mid", "wave-layer-fore"] as const;
const BOBS = ["boat-bob-deep-1", "boat-bob-deep-2", "boat-bob-deep-3"] as const;

export default function WaveDivider({
  tone = "light-to-tint",
  height = 100,
  flip = false,
}: WaveDividerProps) {
  const palette = TONE_PALETTES[tone];

  return (
    <div
      className={`relative w-full overflow-hidden ${palette.bg} ${flip ? "scale-y-[-1]" : ""}`}
      style={{ height }}
      aria-hidden="true"
    >
      {PATHS.map((d, i) => (
        <div key={i} className={BOBS[i]} style={{ position: "absolute", inset: 0 }}>
          <div className={`absolute inset-x-0 bottom-0 ${DRIFTS[i]}`} style={{ height }}>
            <svg
              viewBox="0 0 2880 160"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block", width: "200%", height }}
            >
              <path d={d} fill={palette.layers[i]} />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
