import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL || "https://mardelplata.dev.ar";
const OUT = process.env.OUT_DIR || path.resolve("docs/qa/mobile-responsive-2026-11-21/before");
const WIDTHS = (process.env.WIDTHS || "320,360,390,412,768").split(",").map(Number);
const ROUTES = (process.env.ROUTES || "/,/eventos,/prensa,/bolsa,/auth/login,/codigo-de-conducta,/brand,/primer-trabajo,/estudiar,/proyectos,/blog,/reglamento").split(",");
const HEIGHT = Number(process.env.HEIGHT || 844);

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--disable-dev-shm-usage"],
});

const report = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: HEIGHT },
    deviceScaleFactor: 2,
    isMobile: width < 768,
    hasTouch: width < 768,
    userAgent:
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    locale: "es-AR",
  });
  const page = await context.newPage();
  for (const route of ROUTES) {
    const url = `${BASE}${route}`;
    const slug = route === "/" ? "home" : route.replace(/^\//, "").replaceAll("/", "-");
    const file = path.join(OUT, `${slug}-${width}.png`);
    let status = "ok";
    let metrics = {};
    try {
      const res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
      status = res?.status() ?? 0;
      await page.waitForTimeout(600);
      metrics = await page.evaluate(() => {
        const root = document.documentElement;
        const sw = root.scrollWidth;
        const iw = window.innerWidth;
        const overflow = sw > iw + 1;
        const offenders = [];
        if (overflow) {
          const all = Array.from(document.querySelectorAll("body *"));
          for (const el of all) {
            const r = el.getBoundingClientRect();
            if (r.width < 1 || r.height < 1) continue;
            if (r.right > iw + 1 || r.left < -1) {
              const tag = el.tagName.toLowerCase();
              const cls = (el.className && typeof el.className === "string") ? el.className.slice(0, 80) : "";
              const text = (el.innerText || "").replace(/\s+/g, " ").slice(0, 60);
              offenders.push({
                tag,
                cls,
                left: Math.round(r.left),
                right: Math.round(r.right),
                width: Math.round(r.width),
                text,
              });
              if (offenders.length >= 12) break;
            }
          }
        }
        const clipped = [];
        const skip = new Set(["html","body","script","style","link","img"]);
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width < 8 || r.height < 8) continue;
          if (skip.has(el.tagName.toLowerCase())) continue;
          if (r.right > iw + 1) {
            const text = (el.innerText || "").replace(/\s+/g, " ").slice(0, 50);
            const tag = el.tagName.toLowerCase();
            const cls = (el.className && typeof el.className === "string") ? el.className.slice(0, 80) : "";
            if (["div","span","section","main","header","footer","nav","aside"].includes(tag) && !text) continue;
            clipped.push({ tag, cls, right: Math.round(r.right), text });
            if (clipped.length >= 8) break;
          }
        }
        return {
          scrollWidth: sw,
          innerWidth: iw,
          overflow,
          clipped: clipped.length,
          title: document.title,
          offenders: overflow ? offenders : clipped,
        };
      });
      await page.screenshot({ path: file, fullPage: route !== "/" });
    } catch (err) {
      status = `error: ${err.message}`;
    }
    report.push({ width, route, status, file, ...metrics });
    const flag = metrics.overflow ? "OVERFLOW" : (metrics.clipped ? `CLIP(${metrics.clipped})` : "fit");
    console.log(`${width} ${route} ${status} ${flag} sw=${metrics.scrollWidth || "?"} iw=${metrics.innerWidth || "?"}`);
  }
  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
const overflows = report.filter((r) => r.overflow);
console.log(`\nDone. ${overflows.length}/${report.length} overflow cases. Report: ${path.join(OUT, "report.json")}`);
