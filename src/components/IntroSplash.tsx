// Server-rendered terminal-boot splash with a coastal twist:
// CLI lines stagger in (`tide.sync`, `horizon.calibrate`, `ocean.deploy`),
// the wordmark glitches once, a scan band sweeps down, and a tilde tide
// drifts at the bottom. Faint aurora keeps the "mar" feel.
//
// Hidden synchronously via inline head script (html.intro-seen) on revisits
// or for users with reduced motion.

const TILDES = "~ ".repeat(120);

export default function IntroSplash() {
  return (
    <div
      aria-hidden="true"
      className="intro-splash glitch-flicker fixed inset-0 z-[100] bg-[#040414] pointer-events-none overflow-hidden"
    >
      {/* Faint aurora — the only "ocean" decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="splash-aurora absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vmin] h-[100vmin] rounded-full bg-ocean-400/15 blur-[160px]" />
      </div>

      {/* Glitch scan band — single sweep down */}
      <div className="glitch-sweep absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-ocean-300/60 to-transparent" />
      <div
        className="glitch-sweep absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400/30 to-transparent"
        style={{ animationDelay: "420ms" }}
      />

      {/* CLI block — centered */}
      <div className="absolute inset-0 grid place-items-center px-6">
        <pre className="font-mono text-[0.78rem] sm:text-sm text-ocean-100/90 leading-7 tracking-tight">
          <span className="term-line block" style={{ animationDelay: "0ms" }}>
            <span className="text-ocean-300">~</span>
            <span className="text-zinc-500"> booting · </span>
            <span className="glitch-rgb text-white font-semibold">mardelplata.dev</span>
          </span>
          <span className="term-line block mt-3" style={{ animationDelay: "120ms" }}>
            <span className="text-ocean-300">[ ✓ ]</span>
            <span className="text-zinc-400"> tide.sync</span>
          </span>
          <span className="term-line block" style={{ animationDelay: "220ms" }}>
            <span className="text-ocean-300">[ ✓ ]</span>
            <span className="text-zinc-400"> horizon.calibrate</span>
          </span>
          <span className="term-line block" style={{ animationDelay: "320ms" }}>
            <span className="text-ocean-300">[ ✓ ]</span>
            <span className="text-zinc-400"> ocean.deploy</span>
          </span>
          <span className="term-line block mt-4" style={{ animationDelay: "440ms" }}>
            <span className="text-zinc-600">→</span>
            <span className="text-ocean-200"> ready.</span>
            <span className="terminal-cursor text-ocean-300 ml-1">_</span>
          </span>
        </pre>
      </div>

      {/* Tilde tide — bottom drifting progress signal */}
      <div className="absolute inset-x-0 bottom-12 overflow-hidden h-6 px-6 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="splash-tide whitespace-nowrap font-mono text-ocean-300/45 text-base">
          {TILDES}
          {TILDES}
        </div>
      </div>
    </div>
  );
}
