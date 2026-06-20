// Builders de JSON-LD (schema.org) tipados. Cada función devuelve un objeto
// plano listo para inyectar con <JsonLd>. Ver docs/nomad-it-hub/04-seo.md §2.
//
// Regla: el contenido debe ser verificable. No inventar datos en los schemas.

import {
  SITE_DESCRIPTION,
  SITE_LEGAL_NAME,
  SITE_LOGO,
  SITE_NAME,
  SITE_SOCIALS,
  SITE_URL,
  absoluteUrl,
} from "./site";

/** Tipo laxo para objetos JSON-LD: estructura libre de schema.org. */
export type JsonLdObject = Record<string, unknown>;

/** Organization global de MdPDev. Va en el layout raíz. */
export function organizationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: SITE_LEGAL_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    description: SITE_DESCRIPTION,
    foundingLocation: {
      "@type": "Place",
      name: "Mar del Plata, Buenos Aires, Argentina",
    },
    areaServed: {
      "@type": "City",
      name: "Mar del Plata",
    },
    sameAs: SITE_SOCIALS,
  };
}

/** WebSite global con SearchAction (sitelinks searchbox). Va en el layout raíz. */
export function webSiteSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "es-AR",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export interface EventSchemaInput {
  name: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  locationName?: string | null;
  url?: string | null;
  isOnline?: boolean;
  image?: string | null;
}

/** Event individual (rich results de eventos). Ver F2 en el plan. */
export function eventSchema(input: EventSchemaInput): JsonLdObject {
  const location = input.isOnline
    ? {
        "@type": "VirtualLocation",
        url: input.url ?? SITE_URL,
      }
    : {
        "@type": "Place",
        name: input.locationName ?? "Mar del Plata",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mar del Plata",
          addressRegion: "Buenos Aires",
          addressCountry: "AR",
        },
      };

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    startDate: input.startDate,
    ...(input.endDate ? { endDate: input.endDate } : {}),
    eventAttendanceMode: input.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location,
    ...(input.image ? { image: [input.image] } : {}),
    ...(input.url ? { url: input.url } : {}),
    organizer: { "@id": `${SITE_URL}/#organization` },
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Path relativo ("/eventos") o URL absoluta. */
  path: string;
}

/** BreadcrumbList para rutas anidadas. */
export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage — clave para featured snippets y citas de LLMs. */
export function faqPageSchema(items: FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface ItemListEntry {
  name: string;
  /** Path relativo o URL absoluta del ítem. */
  path: string;
}

/** ItemList para páginas de listado (empresas, work spots, etc.). */
export function itemListSchema(items: ItemListEntry[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
