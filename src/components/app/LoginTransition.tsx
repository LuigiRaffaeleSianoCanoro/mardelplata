"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "[ok] handshake :: ppdc/ssr",
  "[ok] drift compatibility verified",
  "[..] uplink shatterdome",
  "[ok] bearing 270° · depth 1200m",
  "[>>] redirect → /perfil",
];

export default function LoginShell() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setShown((n) => (n >= BOOT_LINES.length ? n : n + 1));
    }, 140);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative w-full h-full glass-card glass-card-amber overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0E0E14 0%, #0A0A0F 100%)",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }}
    >
      <div className="absolute inset-0 tx-grid opacity-25" />
      <div
        className="absolute left-0 right-0 h-px scan-sweep"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.85), transparent)" }}
      />

      <div className="relative h-full p-7 flex flex-col gap-5 font-mono">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <span className="kicker kicker-amber flex items-center gap-2">
            <span className="dot-amber" /> shatterdome
          </span>
          <span className="kicker text-white/45 flex items-center gap-2">
            uplink
          </span>
        </div>

        <p className="display-thin text-white text-2xl tracking-[0.18em]">
          ACCESS&nbsp;GRANTED
        </p>

        <div className="space-y-1 text-[0.72rem] text-white/65 flex-1 font-light">
          {BOOT_LINES.slice(0, shown).map((line, i) => (
            <div key={line} className="boot-line" style={{ animationDelay: `${i * 40}ms` }}>
              {line}
            </div>
          ))}
          {shown < BOOT_LINES.length && (
            <span className="inline-block w-2 h-3 bg-neon-amber caret-blink align-middle" />
          )}
        </div>

        <p className="coord-line">
          MDP <span className="sep">·</span> <span className="num">38°00&apos;S</span> <span className="sep">·</span> <span className="num">057°33&apos;W</span>
        </p>
      </div>
    </div>
  );
}
