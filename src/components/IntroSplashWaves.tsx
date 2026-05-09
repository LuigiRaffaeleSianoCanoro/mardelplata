"use client";

// Variante de IntroSplash con la malla cyan reemplazada por la malla de
// olas low-poly de LowPolyDissolveIntro. Mantiene aurora, sonar, CLI,
// coord footer — y reemplaza el iris collapse por una onda tipo
// piedra-en-agua (MagicRings) como puente al home.

import { useEffect, useMemo, useRef, useState } from "react";

interface IntroSplashWavesProps {
  onComplete?: () => void;
}

const COLS = 24;
const ROWS = 13;

function seeded(i: number, salt = 1) {
  const x = Math.sin(i * 9301.0 + salt * 49297.0) * 233280.0;
  return x - Math.floor(x);
}

type V = {
  idx: number;
  row: number;
  col: number;
  x: number;
  baseY: number;
  yJ: number;
  ampDepth: number;
  detailMix: number;
  rowPhase: number;
  xN: number;
  brightStatic: number;
};

type T = {
  idx: number;
  v: [number, number, number];
  crest: boolean;
  glint: boolean;
  baseAlpha: number;
};

// Default deterministico para SSR — sin esto el SVG mesh nunca aparece
// hasta que React hidrate y el useEffect de setSize fire. Como ambos
// SSR y cliente arrancan con esto, no hay hydration mismatch; despues
// del mount el useEffect lo reemplaza con dimensiones reales.
const SSR_DEFAULT_SIZE = { w: 1920, h: 1080 };

export default function IntroSplashWaves({ onComplete }: IntroSplashWavesProps) {
  const [size, setSize] = useState<{ w: number; h: number }>(SSR_DEFAULT_SIZE);
  const polyRefs = useRef<(SVGPolygonElement | null)[]>([]);
  // Si el head script ya marcó <html class="intro-seen"> (revisita,
  // reduced-motion o slow connection), salteamos toda la intro. Evita
  // que corran los intervalos de HUD live para nada.
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) {
      setSkip(true);
      onComplete?.();
    }
  }, [onComplete]);

  // HUD live readouts: tiempo UTC con ms y coordenadas con jitter sutil.
  // `now` arranca null para evitar hydration mismatch (Date() difiere
  // entre SSR y cliente). Se setea al montar.
  const [now, setNow] = useState<Date | null>(null);
  const [latFrac, setLatFrac] = useState(18.473);
  const [lngFrac, setLngFrac] = useState(9.821);
  const [hdg, setHdg] = useState(218);
  const [sog, setSog] = useState(7.4);
  const [xte, setXte] = useState(0.04);

  // Lifecycle del splash:
  // - active=false a 2950ms (post snap-out): para rAF del mesh +
  //   setInterval del HUD y desmonta el splash entero (saca SVG con
  //   624 polygons del render tree).
  // - beamMounted=false a 4200ms: la luz del faro completa su CSS
  //   animation y desmontamos el overlay tambien.
  const [active, setActive] = useState(true);
  const [beamMounted, setBeamMounted] = useState(true);
  useEffect(() => {
    if (skip) {
      setActive(false);
      setBeamMounted(false);
      return;
    }
    const t1 = setTimeout(() => setActive(false), 2950);
    const t2 = setTimeout(() => setBeamMounted(false), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [skip]);

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!active) return;
    setNow(new Date());
    const id = setInterval(() => {
      setNow(new Date());
      setLatFrac((v) => Math.max(0, Math.min(60, v + (Math.random() - 0.5) * 0.04)));
      setLngFrac((v) => Math.max(0, Math.min(60, v + (Math.random() - 0.5) * 0.04)));
      setHdg((v) => 215 + Math.sin(performance.now() / 600) * 4 + (Math.random() - 0.5) * 0.4);
      setSog((v) => Math.max(0, Math.min(15, v + (Math.random() - 0.5) * 0.08)));
      setXte((v) => Math.max(-0.2, Math.min(0.2, v + (Math.random() - 0.5) * 0.01)));
    }, 50);
    return () => clearInterval(id);
  }, [active]);

  // Variante extendida: animaciones internas 2200ms, container 2800ms
  // (con black hold + crossfade al final). onComplete dispara a 2900ms
  // (100ms de buffer sobre el fade final del container a 100% = 2800ms).
  useEffect(() => {
    if (!onComplete) return;
    const t = setTimeout(() => onComplete(), 2900);
    return () => clearTimeout(t);
  }, [onComplete]);

  const horizonY = size ? size.h * 0.42 : 0;

  const { verts, tris } = useMemo<{ verts: V[]; tris: T[] }>(() => {
    if (!size) return { verts: [], tris: [] };
    const W = size.w;
    const H = size.h;
    const horY = H * 0.42;
    const colW = W / COLS;

    const gridIdx: number[][] = [];
    const flat: V[] = [];
    let vIdx = 0;

    for (let r = 0; r <= ROWS; r++) {
      const rowIdx: number[] = [];
      const tDepth = r / ROWS;
      const baseRowY = horY + Math.pow(tDepth, 1.55) * (H * 0.6);
      const ampDepth = 4 + Math.pow(tDepth, 1.6) * 48;
      const detailMix = tDepth;
      const rowPhase = r * 0.22;

      for (let c = 0; c <= COLS; c++) {
        const xN = c / COLS;
        const xJ =
          c === 0 || c === COLS
            ? 0
            : (seeded(r * 131 + c, 3) - 0.5) * colW * 0.18;
        const yJ = (seeded(r * 211 + c, 7) - 0.5) * 5;
        const yWave0 =
          Math.sin(xN * Math.PI * 2.4 + rowPhase) * ampDepth +
          Math.sin(xN * Math.PI * 5.6 + r * 0.7) * ampDepth * 0.16 * detailMix;
        const brightStatic = Math.min(
          1,
          0.38 + Math.max(0, -yWave0 / Math.max(ampDepth, 1)) * 0.65,
        );
        flat.push({
          idx: vIdx,
          row: r,
          col: c,
          x: c * colW + xJ,
          baseY: baseRowY,
          yJ,
          ampDepth,
          detailMix,
          rowPhase,
          xN,
          brightStatic,
        });
        rowIdx.push(vIdx);
        vIdx++;
      }
      gridIdx.push(rowIdx);
    }

    const triList: T[] = [];
    const crestThreshold = 0.72;
    const pushTri = (a: number, b: number, c: number) => {
      const va = flat[a], vb = flat[b], vc = flat[c];
      const triBright =
        (va.brightStatic + vb.brightStatic + vc.brightStatic) / 3;
      const isCrest = triBright > crestThreshold;
      const glint = !isCrest && seeded(triList.length, 13) > 0.88;
      triList.push({
        idx: triList.length,
        v: [a, b, c],
        crest: isCrest,
        glint,
        baseAlpha: isCrest ? 1.0 : glint ? 0.85 : 0.55,
      });
    };

    for (let r = 0; r < gridIdx.length - 1; r++) {
      for (let c = 0; c < COLS; c++) {
        const a = gridIdx[r][c];
        const b = gridIdx[r][c + 1];
        const cc = gridIdx[r + 1][c];
        const d = gridIdx[r + 1][c + 1];
        const flip = (r + c) % 2 === 0;
        if (flip) {
          pushTri(a, b, cc);
          pushTri(b, d, cc);
        } else {
          pushTri(a, b, d);
          pushTri(a, d, cc);
        }
      }
    }

    return { verts: flat, tris: triList };
  }, [size]);

  useEffect(() => {
    if (!size || verts.length === 0 || !active) return;
    const start = performance.now();
    let raf = 0;
    const xBuf = new Float32Array(verts.length);
    const yBuf = new Float32Array(verts.length);

    const tick = () => {
      const t = (performance.now() - start) / 1000;
      for (let i = 0; i < verts.length; i++) {
        const v = verts[i];
        const ampD = v.ampDepth * 1.9;
        const wave1 =
          Math.sin(v.xN * Math.PI * 2.4 + t * 1.4 + v.rowPhase) * ampD;
        const wave2 =
          Math.sin(v.xN * Math.PI * 5.6 + v.row * 0.7 + t * 2.3) *
          ampD * 0.18 * v.detailMix;
        const swellBand = Math.exp(
          -Math.pow((v.xN - ((t * 0.22) % 1.6 - 0.2)) / 0.28, 2),
        );
        const swell =
          swellBand * Math.sin(v.xN * Math.PI * 1.4 + t * 0.9) * 32 * v.detailMix;
        yBuf[i] = v.baseY + wave1 + wave2 - swell + v.yJ;
        xBuf[i] = v.x;
      }
      for (let i = 0; i < tris.length; i++) {
        const el = polyRefs.current[i];
        if (!el) continue;
        const tri = tris[i];
        const ax = xBuf[tri.v[0]], ay = yBuf[tri.v[0]];
        const bx = xBuf[tri.v[1]], by = yBuf[tri.v[1]];
        const cx = xBuf[tri.v[2]], cy = yBuf[tri.v[2]];
        el.setAttribute(
          "points",
          `${ax.toFixed(1)},${ay.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`,
        );
        // CSS .lpd-mesh polygon tiene `stroke-opacity: 0` hardcoded — el
        // setAttribute pierde frente a CSS, hay que usar inline style.
        el.style.strokeOpacity = tri.baseAlpha.toFixed(3);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size, verts, tris, active]);

  if (skip) return null;

  return (
    <>
    {active && (
    <div
      aria-hidden="true"
      className="intro-splash intro-splash--ext fixed inset-0 z-[100] bg-[#0A0A0F] pointer-events-none overflow-hidden"
    >
      {/* Malla de olas low-poly — reemplaza el tx-grid del splash original.
          El mask radial mantiene el viñeteado del piso original. */}
      <div className="absolute inset-0 opacity-90 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_50%,#000_30%,transparent_92%)]">
        {size && (
          <svg
            className="intro3-glitch-rest"
            viewBox={`0 0 ${size.w} ${size.h}`}
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0 }}
            suppressHydrationWarning
          >
            <defs>
              {/* El id debe ser exactamente "lpd-grad" — el CSS .lpd-mesh
                  polygon tiene `stroke: url(#lpd-grad)` hardcoded. */}
              <linearGradient
                id="lpd-grad"
                gradientUnits="userSpaceOnUse"
                x1={0}
                y1={size.h * 0.35}
                x2={size.w}
                y2={size.h}
              >
                {/* Violet → indigo → blue → near-white. El violeta arriba
                    (cerca del horizonte) le da onda twilight/login, el
                    blanco abajo es la luz lunar quebrándose en la cresta. */}
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="35%" stopColor="#6366f1" />
                <stop offset="65%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
            </defs>
            <line
              className="lpd-horizon"
              x1={0}
              y1={horizonY}
              x2={size.w}
              y2={horizonY}
              style={{ opacity: 0.45 }}
            />
            <g className="lpd-mesh">
              {tris.map((t) => (
                <polygon
                  key={t.idx}
                  ref={(el) => {
                    polyRefs.current[t.idx] = el;
                  }}
                  className={
                    t.crest
                      ? "lpd-tri-crest"
                      : t.glint
                        ? "lpd-tri-glint"
                        : undefined
                  }
                />
              ))}
            </g>
          </svg>
        )}
      </div>

      {/* ─── HUD wrapper anidado ────────────────────────────────────
          El outer recibe splash-content-fade (TV-off collapse a 50-66%).
          El inner recibe intro3-shake-hud (sacudón a 18-30%, en sincro
          con el shell glitch). Los dos transforms se componen en el
          stack del browser, así que cada elemento HUD adentro vibra
          *durante* el glitch de la consola y después colapsa con el
          resto del splash. */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 intro3-shake-hud pointer-events-none">
          {/* corner brackets */}
          <div className="hud-corner hud-corner--tl" />
          <div className="hud-corner hud-corner--tr" />
          <div className="hud-corner hud-corner--bl" />
          <div className="hud-corner hud-corner--br" />

          {/* top status bar */}
          <div className="absolute top-6 left-10 hud-label">
            <span className="hud-status-dot" />
            VESSEL · MDP-EDGE-01 <span className="hud-label--dim">·</span>{" "}
            <span className="hud-ok">UNDERWAY</span>
          </div>
          <div className="absolute top-6 right-10 hud-label">
            <span className="hud-label--dim">↺ </span>
            {now ? now.toISOString().slice(11, 23) : "00:00:00.000"} UTC
            <span className="hud-label--dim"> · GPS </span>
            <span className="hud-ok">LOCK</span>
            <span className="hud-label--dim"> · </span>
            <span className="hud-accent">12 SAT</span>
          </div>

          {/* bearing scale top-center */}
          <div className="absolute top-14 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="hud-bearing">
              <span>270</span>
              <span>280</span>
              <span>290</span>
              <span className="n">N</span>
              <span>010</span>
              <span>020</span>
              <span>030</span>
            </div>
            <div className="hud-bearing-tick" />
          </div>

          {/* nav data (left rail) — SOG/COG/HDG/XTE/RUDDER */}
          <div className="hud-rail hud-rail--left absolute">
        <div className="hud-rail-row">
          <span className="hud-label--dim">SOG</span>
          <span className="hud-accent">{sog.toFixed(1)}</span>
          <span className="hud-label--dim">kt</span>
        </div>
        <div className="hud-rail-row">
          <span className="hud-label--dim">COG</span>
          <span className="hud-accent">{Math.round(hdg).toString().padStart(3, "0")}°</span>
          <span className="hud-label--dim">T</span>
        </div>
        <div className="hud-rail-row">
          <span className="hud-label--dim">HDG</span>
          <span>{Math.round(hdg + 3).toString().padStart(3, "0")}°</span>
          <span className="hud-label--dim">M</span>
        </div>
        <div className="hud-rail-row">
          <span className="hud-label--dim">XTE</span>
          <span className={Math.abs(xte) > 0.1 ? "hud-warn" : ""}>
            {xte >= 0 ? "+" : "−"}
            {Math.abs(xte).toFixed(2)}
          </span>
          <span className="hud-label--dim">nm</span>
        </div>
        <div className="hud-rail-row">
          <span className="hud-label--dim">RUDDER</span>
          <span>02°</span>
          <span className="hud-label--dim">S</span>
        </div>
      </div>

      {/* ─── HUD: depth ladder (right rail) ────────────────────────── */}
      <div className="hud-rail hud-rail--right absolute">
        <div className="hud-rail-row">
          <span>−005m</span>
          <span className="hud-rail-tick" />
        </div>
        <div className="hud-rail-row">
          <span>−010m</span>
          <span className="hud-rail-tick" />
        </div>
        <div className="hud-rail-row">
          <span className="hud-accent">−012m</span>
          <span className="hud-rail-tick hud-rail-tick--mark" />
        </div>
        <div className="hud-rail-row">
          <span>−015m</span>
          <span className="hud-rail-tick" />
        </div>
        <div className="hud-rail-row">
          <span>−020m</span>
          <span className="hud-rail-tick" />
        </div>
        <div className="hud-rail-row">
          <span>−025m</span>
          <span className="hud-rail-tick" />
        </div>
      </div>

      {/* ─── HUD: crosshair central detrás del terminal ────────────── */}
      <div className="absolute inset-0">
        <div className="hud-crosshair">
          <span className="hud-crosshair-dot" />
        </div>
      </div>

      {/* ─── HUD: RADAR widget (esquina inferior izquierda) ────────── */}
      <div
        className="hud-radar-frame absolute"
        style={{ left: 28, bottom: 90 }}
      >
        <div className="hud-label hud-label--dim">RADAR · 12NM</div>
        <div className="sonar-loader" style={{ width: 78, height: 78 }}>
          <span className="grid" />
          <span className="sweep" />
          <span className="ring" />
          <span className="ring delay" />
          <span className="core" />
        </div>
        <div className="hud-label hud-accent" style={{ fontSize: 9 }}>
          TARGETS · 0 · CLEAR
        </div>
      </div>

      {/* ─── HUD: waypoint / ETA (esquina inferior derecha) ────────── */}
      <div className="absolute bottom-24 right-10 text-right">
        <div className="hud-label hud-label--dim">NEXT WAYPOINT</div>
        <div className="hud-label hud-accent" style={{ fontSize: 13, letterSpacing: "0.16em" }}>
          MDP-PORT
        </div>
        <div className="hud-label mt-1" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
          <span className="hud-accent">2.4</span>
          <span className="hud-label--dim">nm · BRG </span>
          <span className="hud-accent">198°</span>
          <span className="hud-label--dim">T</span>
        </div>
        <div className="hud-label hud-label--dim mt-2">ETA</div>
        <div className="hud-label" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
          03:14:18 UTC
        </div>
      </div>
        </div>
      </div>

      {/* Panel terminal SSH centrado — narrativa de login. Reemplaza al CLI
          "handshake" del IntroSplash original. Wrap absolute para que entre
          en la regla splash-content-fade y desaparezca con el iris. */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          className="lpd-terminal intro3-glitch-shell"
          style={{
            position: "static",
            left: "auto",
            right: "auto",
            top: "auto",
            bottom: "auto",
          }}
          aria-hidden
        >
          <div className="lpd-term-head">
            <span className="lpd-term-dot lpd-term-dot--r" />
            <span className="lpd-term-dot lpd-term-dot--y" />
            <span className="lpd-term-dot lpd-term-dot--g" />
            <span className="lpd-term-title">root@mdp-edge-01: ~</span>
          </div>
          <div className="lpd-term-body">
            <div className="lpd-term-line" style={{ "--d": "0.05s" } as React.CSSProperties}>
              <span className="lpd-term-prompt">$</span>
              <span> ssh root@mdp-edge-01.lan</span>
            </div>
            <div className="lpd-term-line lpd-term-line--ok" style={{ "--d": "0.18s" } as React.CSSProperties}>
              <span className="lpd-term-mark">✓</span>
              <span> keypair · session 4f3a-2c19</span>
            </div>
            <div className="lpd-term-line" style={{ "--d": "0.32s" } as React.CSSProperties}>
              <span className="lpd-term-prompt">$</span>
              <span> systemctl --state=active --type=service</span>
            </div>
            <div className="lpd-term-line" style={{ "--d": "0.48s" } as React.CSSProperties}>
              <span className="lpd-term-bullet lpd-term-bullet--ok">●</span>
              <span> mdp-api.service</span>
              <span className="lpd-term-meta"> active · 312ms</span>
            </div>
            <div className="lpd-term-line" style={{ "--d": "0.58s" } as React.CSSProperties}>
              <span className="lpd-term-bullet lpd-term-bullet--ok">●</span>
              <span> postgres-15.service</span>
              <span className="lpd-term-meta"> active · 8h uptime</span>
            </div>
            <div className="lpd-term-line" style={{ "--d": "0.68s" } as React.CSSProperties}>
              <span className="lpd-term-bullet lpd-term-bullet--ok">●</span>
              <span> redis.service</span>
              <span className="lpd-term-meta"> active</span>
            </div>
            <div className="lpd-term-line" style={{ "--d": "0.78s" } as React.CSSProperties}>
              <span className="lpd-term-bullet lpd-term-bullet--ok">●</span>
              <span> nginx-edge.service</span>
              <span className="lpd-term-meta"> active</span>
            </div>
            <div className="lpd-term-line" style={{ "--d": "0.92s" } as React.CSSProperties}>
              <span className="lpd-term-prompt">$</span>
              <span> tail -f /var/log/mdp/mesh.log</span>
            </div>
            <div className="lpd-term-line lpd-term-line--ok" style={{ "--d": "1.05s" } as React.CSSProperties}>
              <span className="lpd-term-mark">[OK]</span>
              <span> mesh.up · 312 nodes online</span>
              <span className="lpd-term-caret">▍</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── HUD: coord footer con readout vivo ────────────────────── */}
      <div className="absolute inset-x-0 bottom-12 flex justify-center px-6">
        <p className="coord-line">
          MDP <span className="sep">·</span>
          <span className="num">
            38°00&apos;{latFrac.toFixed(3)}&quot;S
          </span>
          <span className="sep">·</span>
          <span className="num">
            057°33&apos;{lngFrac.toFixed(3)}&quot;W
          </span>
          <span className="sep">·</span>
          ATLÁNTICO SUR
        </p>
      </div>

      {/* Iris lock-off outro + boot polygons que "prenden la pantalla".
          Van adentro de .splash-iris para escapar del splash-content-fade
          (que se aplica a .intro-splash > .absolute:not(.splash-iris)). */}
      <div className="splash-iris">
        <span className="iris-line" />
        {/* boot-tri polygons removidos */}
      </div>

    </div>
    )}

    {/* Luz del faro — overlay sibling del splash. Sigue vivo mientras
        el splash ya desmontado, asi su animacion CSS termina limpia.
        beamMounted=false a 4200ms saca el overlay del DOM. */}
    {beamMounted && (
      <div className="lighthouse-beam-overlay" aria-hidden="true">
        <div className="lighthouse-beam-core" />
        <div className="lighthouse-beam-spread" />
      </div>
    )}
    </>
  );
}
