import fs from "node:fs";
import path from "node:path";

const MD_PATH = path.join(
  process.cwd(),
  "src/content/codigo-de-conducta/codigo-de-conducta.md",
);

export function readCodeOfConductMarkdown(): string {
  return fs.readFileSync(MD_PATH, "utf8");
}

/** Cuerpo del documento sin el título H1 (el hero de la página lo muestra). */
export function readCodeOfConductBodyMarkdown(): string {
  return readCodeOfConductMarkdown().replace(/^#\s+.+\n+/, "");
}
