import type { FeedItem, FeedSource } from "./types";

// Parser tiny de RSS 2.0 + Atom. Sin dependencias — XML real es siempre
// arriesgado parsear con regex pero los feeds que nos interesan (Medium,
// Substack, Dev.to, Hashnode, GitHub releases, YouTube) son
// suficientemente regulares para que esto alcance.

const ENTITY_MAP: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&(lt|gt|amp|quot|apos|nbsp);/g, (m) => ENTITY_MAP[m] ?? m)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Lee el contenido textual de la primera ocurrencia de `<tag>...</tag>` en
 *  el bloque. Maneja CDATA y atributos arbitrarios en la etiqueta. */
function extractTag(block: string, tag: string): string | null {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `<${escaped}(?:\\s[^>]*)?>\\s*(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))\\s*</${escaped}>`,
    "i",
  );
  const m = block.match(re);
  if (!m) return null;
  return (m[1] ?? m[2] ?? "").trim();
}

/** Lee un atributo de la primera ocurrencia de `<tag ...>` que cumpla un
 *  filtro adicional opcional (ej: `rel="alternate"`). */
function extractAttr(
  block: string,
  tag: string,
  attr: string,
  attrFilter?: { name: string; value: string },
): string | null {
  const filterRe = attrFilter
    ? `(?=[^>]*\\b${attrFilter.name}=["']${attrFilter.value}["'])`
    : "";
  const re = new RegExp(
    `<${tag}\\b${filterRe}[^>]*\\b${attr}=["']([^"']+)["'][^>]*\\/?>`,
    "i",
  );
  const m = block.match(re);
  return m ? m[1] : null;
}

function safeDate(input: string | null): string | null {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export function parseFeed(xml: string, source: FeedSource): FeedItem[] {
  const head = xml.slice(0, 600).toLowerCase();
  const isAtom = /<feed[\s>]/.test(head);
  const blockRe = isAtom
    ? /<entry[\s>][\s\S]*?<\/entry>/g
    : /<item[\s>][\s\S]*?<\/item>/g;
  const blocks = xml.match(blockRe) ?? [];
  const max = source.max ?? 6;
  const items: FeedItem[] = [];

  for (const block of blocks.slice(0, max)) {
    const rawTitle = extractTag(block, "title");
    if (!rawTitle) continue;
    const title = decodeEntities(stripHtml(rawTitle));

    let url: string | null;
    let publishedRaw: string | null;
    let body: string | null;
    let author: string | null;

    if (isAtom) {
      // Atom: <link rel="alternate" href="..."/> ; fallback a <link href="..."/>.
      url =
        extractAttr(block, "link", "href", { name: "rel", value: "alternate" }) ??
        extractAttr(block, "link", "href");
      publishedRaw = extractTag(block, "published") ?? extractTag(block, "updated");
      body = extractTag(block, "content") ?? extractTag(block, "summary");
      author = extractTag(block, "name");
    } else {
      // RSS 2.0
      url = extractTag(block, "link");
      publishedRaw = extractTag(block, "pubDate") ?? extractTag(block, "dc:date");
      body =
        extractTag(block, "content:encoded") ??
        extractTag(block, "description");
      author = extractTag(block, "dc:creator") ?? extractTag(block, "author");
    }

    const publishedAt = safeDate(publishedRaw);
    if (!url || !publishedAt) continue;

    const excerpt = body ? decodeEntities(stripHtml(body)).slice(0, 280) : "";
    const cleanedAuthor = author
      ? decodeEntities(stripHtml(author)).replace(/^by\s+/i, "").slice(0, 60)
      : undefined;

    items.push({
      source: source.key,
      sourceLabel: source.label,
      sourceKind: source.kind,
      title,
      url,
      publishedAt,
      excerpt,
      author: cleanedAuthor,
    });
  }

  return items;
}
