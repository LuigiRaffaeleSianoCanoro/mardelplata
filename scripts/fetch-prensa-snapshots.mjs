#!/usr/bin/env node
/**
 * One-off helper: fetch press URLs and save cleaned article bodies as markdown.
 * Usage: node scripts/fetch-prensa-snapshots.mjs
 */

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "src/content/prensa/archives");

const ITEMS = [
  { id: "cafe-cursor-municipio", url: "https://www.mardelplata.gob.ar/Noticias/mar-del-plata-recibe-caf%C3%A9-cursor-un-espacio-para-desarrolladores-e-interesados-en" },
  { id: "cafe-cursor-mi8", url: "https://mi8.com.ar/coworking-para-desarrolladores-e-interesados-en-ia-se-viene-la-primera-edicion-de-cafe-cursor-en-mar-del-plata/" },
  { id: "cafe-cursor-arrobamdp", url: "https://arrobamdp.com.ar/mar-del-plata-recibe-cafe-cursor-un-encuentro-sobre-inteligencia-artificial/" },
  { id: "cafe-cursor-mardelmakers", url: "https://mardelmakers.com.ar/cafe-cursor-programar-ia-mar-del-plata/" },
  { id: "aticma-puntonoticias", url: "https://puntonoticias.com/mar-del-plata-dev-consolida-su-crecimiento-mediante-una-alianza-estrategica-con-aticma/" },
  { id: "aticma-elretrato", url: "https://elretratodehoy.com.ar/2026/05/26/mar-del-plata-dev-se-alia-con-aticma-y-lleva-tecnologia-musica-e-inteligencia-artificial-en-un-solo-evento/" },
  { id: "bit-beat-infobrisas", url: "https://www.infobrisas.com/noticias/2026/05/26/96243-tecnologia-y-cultura-en-clave-local-llega-bit--beat-con-charlas-ia-y-musica-en-vivo" },
  { id: "bit-beat-0223", url: "https://www.0223.com.ar/nota/2026-5-26-15-40-0-bit-a-bit-el-evento-tecnologico-que-busca-impulsar-el-talento-it-en-mar-del-plata" },
  { id: "bit-beat-municipio", url: "https://www.mardelplata.gob.ar/Noticias/bit-beat-encuentro-interdisciplinario-de-tecnolog%C3%ADa-y-música" },
  { id: "bit-beat-portal-universidad", url: "https://portaluniversidad.org.ar/2026/05/30/bit-beat-un-evento-que-une-arte-y-tecnologia/" },
  { id: "bit-beat-mi8", url: "https://mi8.com.ar/bit-beat-el-encuentro-que-une-arte-musica-e-inteligencia-artificial-en-mar-del-plata/" },
  { id: "bit-beat-mardelmakers-previa", url: "https://mardelmakers.com.ar/mar-del-plata-dev-bit-and-beat-tecnologia-musica/" },
  { id: "bit-beat-ahora", url: "https://ahoramardelplata.com.ar/5/desarrolladores-y-artistas-se-unieron-en-una-jornada-de-innovacion-y-experimentacion-tecnologica" },
  { id: "bit-beat-mardelmakers-post", url: "https://mardelmakers.com.ar/comunidad-desarrolladores-mar-del-plata-dev-bit-and-beat/" },
];

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&Ntilde;/g, "Ñ");
}

function htmlToMarkdown(html) {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, "");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, "");
  s = s.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  s = s.replace(/<footer[\s\S]*?<\/footer>/gi, "");
  s = s.replace(/<header[\s\S]*?<\/header>/gi, "");
  s = s.replace(/<aside[\s\S]*?<\/aside>/gi, "");
  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n\n");
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n\n");
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n\n");
  s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n\n");
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n\n");
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  s = s.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**");
  s = s.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**");
  s = s.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*");
  s = s.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.replace(/[ \t]+\n/g, "\n");
  return s.trim();
}

function extractBody(html) {
  const article =
    html.match(/<article[\s\S]*?<\/article>/i)?.[0] ??
    html.match(/<div[^>]+class="[^"]*entry-content[^"]*"[\s\S]*?<\/div>/i)?.[0] ??
    html.match(/<div[^>]+class="[^"]*post-content[^"]*"[\s\S]*?<\/div>/i)?.[0] ??
    html.match(/<div[^>]+class="[^"]*nota-contenido[^"]*"[\s\S]*?<\/div>/i)?.[0] ??
    html.match(/<main[\s\S]*?<\/main>/i)?.[0] ??
    html;

  const withoutNoise = article
    .replace(/<figure[\s\S]*?<\/figure>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "");

  return htmlToMarkdown(withoutNoise);
}

async function fetchItem({ id, url }) {
  const capturedAt = new Date().toISOString().slice(0, 10);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "MdPDev-PressArchive/1.0 (+https://mardelplata.dev.ar/prensa; community archival)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      return { id, ok: false, error: `HTTP ${res.status}` };
    }
    const html = await res.text();
    const body = extractBody(html);
    if (body.length < 120) {
      return { id, ok: false, error: `Body too short (${body.length} chars)` };
    }
    const md = `<!-- capturedAt: ${capturedAt} -->\n<!-- source: ${url} -->\n\n${body}\n`;
    fs.writeFileSync(path.join(OUT_DIR, `${id}.md`), md, "utf8");
    return { id, ok: true, chars: body.length };
  } catch (err) {
    return { id, ok: false, error: String(err) };
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const results = [];
  for (const item of ITEMS) {
    const r = await fetchItem(item);
    results.push(r);
    console.log(r);
    await new Promise((r) => setTimeout(r, 800));
  }
  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.error("\nFailed:", failed);
    process.exitCode = failed.length === results.length ? 1 : 0;
  }
}

main();
