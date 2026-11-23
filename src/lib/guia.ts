import fs from "node:fs";
import path from "node:path";
import { getGuiaPage, type GuiaPageMeta } from "@/content/guia";

const PAGES_DIR = path.join(process.cwd(), "src/content/guia/pages");

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function inlineMarkdown(text: string): string {
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, href: string) => {
    const safeHref = escapeHtml(href);
    if (isInternalHref(href)) {
      return `<a href="${safeHref}">${label}</a>`;
    }
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s;
}

/** Markdown mínimo a HTML, con links internos sin target=_blank. */
export function guiaMarkdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const parts: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      parts.push("</ul>");
      inList = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }
    if (trimmed.startsWith("### ")) {
      closeList();
      parts.push(`<h3>${inlineMarkdown(trimmed.slice(4))}</h3>`);
    } else if (trimmed.startsWith("## ")) {
      closeList();
      parts.push(`<h2>${inlineMarkdown(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("# ")) {
      closeList();
      parts.push(`<h1>${inlineMarkdown(trimmed.slice(2))}</h1>`);
    } else if (trimmed.startsWith("- ")) {
      if (!inList) {
        parts.push("<ul>");
        inList = true;
      }
      parts.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
    } else {
      closeList();
      parts.push(`<p>${inlineMarkdown(trimmed)}</p>`);
    }
  }
  closeList();
  return parts.join("\n");
}

export function readGuiaPortadaMarkdown(): string {
  return fs.readFileSync(path.join(PAGES_DIR, "00-portada.md"), "utf8");
}

export function readGuiaPageMarkdown(slug: string): string {
  const file = path.join(PAGES_DIR, `${slug}.md`);
  return fs.readFileSync(file, "utf8");
}

export function guiaBodyMarkdown(markdown: string): string {
  return markdown.replace(/^#\s+.+\n+/, "");
}

export function loadGuiaPage(slug: string): { meta: GuiaPageMeta; html: string } | null {
  const meta = getGuiaPage(slug);
  if (!meta) return null;
  const markdown = readGuiaPageMarkdown(slug);
  return { meta, html: guiaMarkdownToHtml(guiaBodyMarkdown(markdown)) };
}

export const GUIA_PROSE =
  "max-w-3xl [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-foreground [&_h2:first-child]:mt-0 [&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:text-[15px] [&_ul]:leading-relaxed [&_ul]:text-muted-foreground [&_li]:text-[15px] [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-medium [&_strong]:text-foreground";
