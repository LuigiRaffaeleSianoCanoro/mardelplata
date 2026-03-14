interface WaveDividerProps {
  fromClass: string;
  toClass: string;
  path?: string;
  flipY?: boolean;
}

export default function WaveDivider({
  fromClass,
  toClass,
  path = "M0,30 C360,55 1080,5 1440,30 L1440,60 L0,60 Z",
  flipY = false,
}: WaveDividerProps) {
  return (
    <div className={`relative overflow-hidden ${fromClass}`} style={{ height: 60 }}>
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className={`absolute bottom-0 w-full h-full ${flipY ? "scale-y-[-1]" : ""}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} className={toClass} />
      </svg>
    </div>
  );
}
