// Inyecta JSON-LD (schema.org) como <script type="application/ld+json">.
// Server component — no necesita "use client". Acepta uno o varios objetos.
// Ver docs/nomad-it-hub/04-seo.md.

import type { JsonLdObject } from "@/lib/seo/jsonLd";

interface JsonLdProps {
  schema: JsonLdObject | JsonLdObject[];
}

// Escapa "<" para evitar que un dato cierre el <script> prematuramente.
function serialize(schema: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

export default function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(schema) }}
    />
  );
}
