/**
 * Home hero tabs: no horizontal overflow and no clipped hero / tabs / dock CTAs.
 * Usage:
 *   BASE_URL=http://127.0.0.1:3000 HOME_QA_FIXTURES=1 npm run dev
 *   node scripts/qa/home-hero-tabs.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const WIDTHS = (process.env.WIDTHS || "360,390,412").split(",").map(Number);
const TABS = ["eventos", "comunidad", "prensa", "empleos"];
const HEIGHT = Number(process.env.HEIGHT || 844);
const OUT = process.env.OUT_DIR;

function metrics(page) {
  return page.evaluate(() => {
    const root = document.scrollingElement;
    const iw = window.innerWidth;
    const sw = root?.scrollWidth ?? document.documentElement.scrollWidth;
    const checks = [];
    const selectors = [
      ["h1", "Hero title"],
      ["nav[aria-label='Secciones']", "Tab bar"],
      ["footer", "Dock"],
      ["aside", "Panel"],
    ];
    for (const [sel, label] of selectors) {
      const el = document.querySelector(sel);
      if (!el) {
        checks.push({ label, ok: false, reason: "missing" });
        continue;
      }
      const r = el.getBoundingClientRect();
      const clipped = r.right > iw + 1.5 || r.left < -1.5 || r.width > iw + 1.5;
      checks.push({
        label,
        ok: !clipped,
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
      });
    }
    const dockBtn = document.querySelector("footer a, footer button");
    const dockText = dockBtn ? (dockBtn.textContent || "").trim().length > 0 : false;
    return {
      innerWidth: iw,
      scrollWidth: sw,
      scrollOk: sw <= iw + 1,
      checks,
      dockHasLabel: dockText,
    };
  });
}

const browser = await chromium.launch({ headless: true });
let failed = 0;

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: HEIGHT },
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    locale: "es-AR",
  });
  const page = await context.newPage();

  for (const tab of TABS) {
    const url = `${BASE}/?tab=${tab}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
    await page.waitForTimeout(600);
    await page.locator(`[data-tab="${tab}"]`).click({ timeout: 15_000 }).catch(() => {});
    await page.waitForTimeout(500);

    const m = await metrics(page);
    const bad = !m.scrollOk || m.checks.some((c) => !c.ok) || !m.dockHasLabel;
    if (bad) failed += 1;

    console.log(
      `${width}px ${tab}: scroll ${m.scrollWidth}/${m.innerWidth} ${m.scrollOk ? "ok" : "OVERFLOW"}` +
        ` | ${m.checks.map((c) => `${c.label}=${c.ok ? "ok" : `clip(${c.right})`}`).join(" ")}` +
        ` | dock=${m.dockHasLabel ? "label" : "EMPTY"}`,
    );

    if (OUT && tab === "comunidad") {
      const fs = await import("node:fs");
      const path = await import("node:path");
      fs.mkdirSync(OUT, { recursive: true });
      await page.screenshot({ path: path.join(OUT, `home-${tab}-${width}.png`) });
    }
  }

  await context.close();
}

await browser.close();

if (failed > 0) {
  console.error(`\n${failed} failing width×tab checks against ${BASE}`);
  process.exit(1);
}
console.log(`\nAll hero tab checks passed (${WIDTHS.length} widths × ${TABS.length} tabs) at ${BASE}`);