import type { Metadata } from "next";
import Shell from "@/components/v3/Shell";
import JsonLd from "@/components/seo/JsonLd";
import { eventSchema, type JsonLdObject } from "@/lib/seo/jsonLd";
import { isOnlineEvent } from "@/lib/events/format";
import { getShellData } from "@/lib/v3/shell-data";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo/site";

// ISR: los datos (eventos curados + Supabase) no necesitan ser en tiempo real.
export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — El Club Tech de Mar del Plata` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

/**
 * Home v3 «Piedra & Código»: una sola pantalla, sin scroll del documento.
 * Tabs (Eventos · Comunidad · Prensa · Empleos) y overlays deep-linkables
 * (`?tab=`, `?evento=`, `?nota=`, `?ver=`). Las subpáginas existentes siguen
 * en sus rutas y se abren desde ⌘K o desde los links de cada panel.
 */
export default async function Home() {
  const data = await getShellData();

  const schemas: JsonLdObject[] = data.upcoming.slice(0, 5).map((e) =>
    eventSchema({
      name: e.title,
      description: e.excerpt,
      startDate: e.startISO,
      endDate: e.endISO,
      locationName: [e.venueName, e.venueAddress].filter(Boolean).join(" · ") || null,
      url: e.registrationUrl,
      isOnline: isOnlineEvent(e.venueName, e.tags),
    }),
  );

  return (
    <>
      {schemas.length > 0 ? <JsonLd schema={schemas} /> : null}
      <Shell data={data} />
    </>
  );
}
