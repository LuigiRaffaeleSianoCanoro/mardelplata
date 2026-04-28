// Decorative ocean fauna — whale, fish, sea lion, splash — all built from
// flat triangles (low-poly silhouettes), matching the wave aesthetic.

interface DoodleProps {
  className?: string;
  fill?: string;
}

export function Whale({ className, fill = "currentColor" }: DoodleProps) {
  // Whale facing right, low-poly silhouette ≈ 240×80
  return (
    <svg
      viewBox="0 0 240 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g fill={fill} stroke={fill} strokeWidth="0.7" strokeLinejoin="round" strokeLinecap="round">
        {/* head wedge */}
        <polygon points="10,46 38,30 38,52" fillOpacity="0.95" />
        {/* upper back front */}
        <polygon points="38,30 92,22 70,46" fillOpacity="0.85" />
        {/* upper back peak */}
        <polygon points="92,22 152,28 120,46" fillOpacity="0.75" />
        {/* upper back rear */}
        <polygon points="152,28 192,32 168,48" fillOpacity="0.8" />
        {/* belly front */}
        <polygon points="38,52 70,46 60,62" fillOpacity="0.9" />
        {/* belly mid */}
        <polygon points="70,46 120,46 100,68" fillOpacity="0.8" />
        {/* belly rear */}
        <polygon points="120,46 168,48 150,66" fillOpacity="0.85" />
        {/* peduncle (tail base) */}
        <polygon points="168,48 192,32 200,52" fillOpacity="0.95" />
        <polygon points="168,48 200,52 178,60" fillOpacity="0.9" />
        {/* tail flukes */}
        <polygon points="200,52 232,18 218,46" fillOpacity="0.95" />
        <polygon points="200,52 232,68 218,54" fillOpacity="0.95" />
        {/* fin */}
        <polygon points="78,52 96,62 92,52" fillOpacity="0.7" />
        {/* eye */}
        <circle cx="44" cy="40" r="1.2" fill="white" opacity="0.9" />
        {/* spout drops */}
        <polygon points="62,18 66,8 70,18" fillOpacity="0.6" />
        <polygon points="56,22 58,14 62,22" fillOpacity="0.5" />
        <polygon points="70,22 74,14 76,22" fillOpacity="0.5" />
      </g>
    </svg>
  );
}

export function BigWhale({ className, fill = "currentColor" }: DoodleProps) {
  // Larger, more detailed humpback-style whale facing right (≈ 400×160).
  // Built entirely from triangles — head, body, dorsal fin, pectoral fin, fluke.
  return (
    <svg
      viewBox="0 0 400 160"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g fill={fill} stroke={fill} strokeWidth="0.8" strokeLinejoin="round" strokeLinecap="round">
        {/* head — bulbous front */}
        <polygon points="14,86 38,68 56,82" fillOpacity="0.95" />
        <polygon points="14,86 56,82 50,108" fillOpacity="0.92" />
        <polygon points="50,108 56,82 90,98" fillOpacity="0.88" />
        {/* lower jaw */}
        <polygon points="14,86 50,108 30,114" fillOpacity="0.88" />
        <polygon points="50,108 90,98 80,124" fillOpacity="0.85" />
        {/* throat pleats hint */}
        <polygon points="80,124 90,98 130,116" fillOpacity="0.78" />
        <polygon points="80,124 130,116 124,138" fillOpacity="0.78" />
        {/* upper back front */}
        <polygon points="38,68 90,52 56,82" fillOpacity="0.85" />
        <polygon points="90,52 56,82 90,98" fillOpacity="0.78" />
        {/* mid back */}
        <polygon points="90,52 156,46 90,98" fillOpacity="0.80" />
        <polygon points="156,46 130,116 90,98" fillOpacity="0.75" />
        {/* dorsal hump */}
        <polygon points="156,46 200,40 188,72" fillOpacity="0.95" />
        <polygon points="156,46 188,72 130,116" fillOpacity="0.78" />
        {/* dorsal fin */}
        <polygon points="200,40 218,28 224,50" fillOpacity="1" />
        <polygon points="200,40 224,50 218,58" fillOpacity="0.9" />
        {/* upper back to tail */}
        <polygon points="200,40 270,48 232,86" fillOpacity="0.82" />
        <polygon points="232,86 270,48 290,82" fillOpacity="0.85" />
        {/* belly / lower body */}
        <polygon points="130,116 188,72 232,86" fillOpacity="0.78" />
        <polygon points="130,116 232,86 200,134" fillOpacity="0.80" />
        <polygon points="232,86 290,82 264,128" fillOpacity="0.80" />
        <polygon points="200,134 232,86 264,128" fillOpacity="0.78" />
        {/* peduncle (tail base) */}
        <polygon points="270,48 318,68 290,82" fillOpacity="0.92" />
        <polygon points="290,82 318,68 312,98" fillOpacity="0.90" />
        <polygon points="290,82 312,98 264,128" fillOpacity="0.85" />
        <polygon points="312,98 264,128 304,118" fillOpacity="0.82" />
        {/* tail flukes — large notched fan */}
        <polygon points="318,68 380,30 350,68" fillOpacity="0.95" />
        <polygon points="318,68 350,68 332,84" fillOpacity="0.90" />
        <polygon points="312,98 358,138 332,98" fillOpacity="0.95" />
        <polygon points="312,98 332,98 304,118" fillOpacity="0.85" />
        <polygon points="350,68 380,30 380,72" fillOpacity="0.85" />
        <polygon points="358,138 388,134 350,108" fillOpacity="0.88" />
        {/* pectoral fin (long, humpback signature) */}
        <polygon points="100,118 146,156 134,128" fillOpacity="0.85" />
        <polygon points="100,118 134,128 116,108" fillOpacity="0.78" />
        <polygon points="146,156 134,128 168,150" fillOpacity="0.7" />
        {/* eye + mouth slit */}
        <circle cx="42" cy="92" r="2" fill="white" opacity="0.92" />
        <polygon points="20,98 38,104 22,106" fill="white" fillOpacity="0.18" stroke="none" />
      </g>
    </svg>
  );
}

export function FishSchool({ className, fill = "currentColor" }: DoodleProps) {
  // Six low-poly fish in arrow formation. Each fish = body triangle + 2 tail triangles + eye.
  const fish = (cx: number, cy: number, k: number, op: number, flip = false) => (
    <g transform={`translate(${cx} ${cy}) scale(${flip ? -k : k} ${k})`} opacity={op}>
      <polygon points="-12,-4 10,0 -12,4" fill={fill} stroke={fill} strokeWidth="0.6" strokeLinejoin="round" />
      <polygon points="-12,-4 -20,-9 -12,0" fill={fill} fillOpacity="0.6" stroke={fill} strokeWidth="0.5" strokeLinejoin="round" />
      <polygon points="-12,4 -20,9 -12,0" fill={fill} fillOpacity="0.6" stroke={fill} strokeWidth="0.5" strokeLinejoin="round" />
      <circle cx="5" cy="-1" r="0.7" fill="white" opacity="0.9" />
    </g>
  );
  return (
    <svg
      viewBox="0 0 200 90"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {fish(40, 45, 1, 0.9)}
      {fish(78, 28, 0.85, 0.75)}
      {fish(78, 62, 0.85, 0.75)}
      {fish(118, 18, 0.7, 0.6)}
      {fish(118, 72, 0.7, 0.6)}
      {fish(160, 45, 0.95, 0.85)}
    </svg>
  );
}

export function SeaLion({ className, fill = "currentColor" }: DoodleProps) {
  // Low-poly sea lion (lobo marino) facing right, head up. ≈ 200×80
  return (
    <svg
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g fill={fill} stroke={fill} strokeWidth="0.7" strokeLinejoin="round" strokeLinecap="round">
        {/* tail flippers */}
        <polygon points="14,42 36,32 30,56" fillOpacity="0.85" />
        <polygon points="30,56 36,32 50,52" fillOpacity="0.75" />
        {/* lower back */}
        <polygon points="36,32 78,22 50,52" fillOpacity="0.85" />
        {/* upper back */}
        <polygon points="78,22 124,18 96,42" fillOpacity="0.75" />
        {/* belly mid */}
        <polygon points="50,52 96,42 90,58" fillOpacity="0.8" />
        <polygon points="90,58 96,42 132,52" fillOpacity="0.85" />
        {/* shoulder */}
        <polygon points="124,18 152,16 132,38" fillOpacity="0.9" />
        {/* front flipper */}
        <polygon points="132,38 122,58 142,46" fillOpacity="0.7" />
        {/* neck */}
        <polygon points="152,16 162,4 158,24" fillOpacity="0.95" />
        {/* head */}
        <polygon points="158,4 174,2 170,18" fillOpacity="0.95" />
        <polygon points="158,4 158,24 170,18" fillOpacity="0.85" />
        {/* snout */}
        <polygon points="174,2 184,8 170,18" fillOpacity="0.9" />
        {/* chest connector */}
        <polygon points="132,38 152,16 132,52" fillOpacity="0.8" />
        {/* eye */}
        <circle cx="170" cy="9" r="0.9" fill="white" opacity="0.9" />
      </g>
    </svg>
  );
}

export function Splash({ className, fill = "currentColor" }: DoodleProps) {
  // Burst of triangular droplets radiating from a center
  const drop = (angle: number, dist: number, size: number, opacity: number) => {
    const rad = (angle * Math.PI) / 180;
    const x = 40 + Math.cos(rad) * dist;
    const y = 40 + Math.sin(rad) * dist;
    const a = angle - 90;
    return (
      <g transform={`translate(${x} ${y}) rotate(${a})`} opacity={opacity}>
        <polygon
          points={`0,${-size} ${size * 0.5},${size * 0.6} ${-size * 0.5},${size * 0.6}`}
          fill={fill}
          stroke={fill}
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
      </g>
    );
  };
  return (
    <svg
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <polygon points="38,38 42,38 40,42" fill={fill} opacity="0.9" />
      {drop(-90, 18, 5.5, 0.9)}
      {drop(-50, 22, 4, 0.7)}
      {drop(-130, 22, 4, 0.7)}
      {drop(-25, 26, 3, 0.55)}
      {drop(-155, 26, 3, 0.55)}
      {drop(0, 28, 2.5, 0.4)}
      {drop(180, 28, 2.5, 0.4)}
    </svg>
  );
}
