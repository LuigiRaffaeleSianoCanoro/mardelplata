// Server-rendered boot splash — Vision Pro × Pacific Rim language.
// Sapphire aurora over matte black, sonar idle, calibration CLI, coord footer.
// Hidden synchronously via inline head script (html.intro-seen) on revisits
// or for users with reduced motion.

export default function IntroSplash() {
  return (
    <div
      aria-hidden="true"
      className="intro-splash fixed inset-0 z-[100] bg-[#0A0A0F] pointer-events-none overflow-hidden"
    >
      {/* Aurora — sapphire glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="splash-aurora absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vmin] h-[100vmin] rounded-full bg-[rgba(59,130,246,0.18)] blur-[160px]" />
      </div>

      {/* Faint grid floor */}
      <div className="absolute inset-0 tx-grid opacity-30 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_50%,#000_30%,transparent_92%)]" />

      {/* Sonar idle ring at center-top */}
      <div className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2">
        <div className="sonar-loader" style={{ width: 120, height: 120 }}>
          <span className="grid" />
          <span className="sweep" />
          <span className="ring" />
          <span className="ring delay" />
          <span className="core" />
        </div>
      </div>

      {/* CLI calibration block */}
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 px-6">
        <pre className="font-mono text-[0.78rem] sm:text-sm leading-7 text-white/85 text-center">
          <span className="term-line block kicker text-white/40 mb-3" style={{ animationDelay: "0ms" }}>
            // initiating handshake
          </span>
          <span className="term-line block" style={{ animationDelay: "120ms" }}>
            <span className="text-[#3B82F6]">[ ✓ ]</span>
            <span className="text-white/55"> tide.sync</span>
          </span>
          <span className="term-line block" style={{ animationDelay: "220ms" }}>
            <span className="text-[#3B82F6]">[ ✓ ]</span>
            <span className="text-white/55"> horizon.calibrate</span>
          </span>
          <span className="term-line block" style={{ animationDelay: "320ms" }}>
            <span className="text-[#3B82F6]">[ ✓ ]</span>
            <span className="text-white/55"> sonar.ping</span>
          </span>
          <span
            className="term-line display-thin block mt-6 text-white text-2xl sm:text-3xl tracking-[0.22em]"
            style={{ animationDelay: "440ms" }}
          >
            mardelplata.dev
          </span>
          <span className="term-line block mt-2 kicker text-white/35" style={{ animationDelay: "560ms" }}>
            ready<span className="terminal-cursor text-[#3B82F6] ml-1">_</span>
          </span>
        </pre>
      </div>

      {/* Coord footer */}
      <div className="absolute inset-x-0 bottom-12 flex justify-center px-6">
        <p className="coord-line">
          MDP <span className="sep">·</span>
          <span className="num">38°00&apos;S</span>
          <span className="sep">·</span>
          <span className="num">057°33&apos;W</span>
          <span className="sep">·</span>
          ATLÁNTICO SUR
        </p>
      </div>

      {/* HUD lock-off — content fades, a horizontal scan line locks at center
          and collapses to a point. Pacific-Rim mech vibe, no brackets. */}
      <div className="splash-iris">
        <span className="iris-line" />
      </div>
    </div>
  );
}
