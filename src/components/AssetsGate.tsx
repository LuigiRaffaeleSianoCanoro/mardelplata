"use client";

// AssetsGate — espera que las imágenes críticas estén cargadas antes
// de dejar que el intro se desvanezca y la home aparezca. Setea
// `html.assets-ready` cuando se cumplen dos condiciones:
//   1. La imagen del hero está cargada
//   2. Pasó un tiempo mínimo (matchea duración del intro)
// El CSS pausa `.intro-splash` y `.page-after-intro` hasta esa clase.

import { useEffect } from "react";

const CRITICAL_IMAGES = ["/hero-wide.png"];
const MIN_INTRO_MS = 2200;

export default function AssetsGate() {
  useEffect(() => {
    const root = document.documentElement;

    // Si la intro está en modo skip (revisita o reduced-motion), liberar
    // de inmediato — no hay intro que esperar.
    if (root.classList.contains("intro-seen")) {
      root.classList.add("assets-ready");
      return;
    }

    const start = performance.now();
    let firedReady = false;

    const fireReady = () => {
      if (firedReady) return;
      firedReady = true;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_INTRO_MS - elapsed);
      window.setTimeout(() => {
        root.classList.add("assets-ready");
      }, wait);
    };

    let pending = CRITICAL_IMAGES.length;
    const onOne = () => {
      pending -= 1;
      if (pending <= 0) fireReady();
    };

    for (const src of CRITICAL_IMAGES) {
      const img = new window.Image();
      img.src = src;
      if (img.complete) onOne();
      else {
        img.onload = onOne;
        img.onerror = onOne;
      }
    }

    // Safety net: nunca dejar al usuario varado más de 8s
    const safetyTimer = window.setTimeout(() => {
      if (!firedReady) fireReady();
    }, 8000);

    return () => window.clearTimeout(safetyTimer);
  }, []);

  return null;
}
