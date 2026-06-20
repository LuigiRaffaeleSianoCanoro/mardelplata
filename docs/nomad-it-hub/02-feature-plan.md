# 02 · Plan de features

> Spec por feature: ruta(s), modelo de datos, RLS, componentes, contenido, estados vacíos,
> fases. Sigue las convenciones de `ARCHITECTURE.md` (App Router, Supabase + RLS, migraciones
> idempotentes numeradas en `scripts/`, JSON estático para contenido curado, client components
> sólo cuando hay interacción).
>
> **Convención de migraciones:** continuar la numeración de `scripts/` (último ≈ `013_*`).
> Las nuevas usan `014_…` en adelante. Todas idempotentes (`IF NOT EXISTS`,
> `DROP POLICY IF EXISTS`, `ON CONFLICT`). Exponer columnas públicas vía vistas `*_public`
> como ya se hace con `profiles_public`.

---

## Decisión transversal: ¿librería de mapas? (F1, F3)

`ARCHITECTURE.md` dice "cero dependencias de UI". Mapas son la única excepción candidata.
Tres caminos, en orden de preferencia:

1. **Sin librería (v1):** lista + filtros + ficha, sin mapa interactivo. Para "ubicación" usamos
   un link a Google Maps y un barrio. **Cero deps, entrega rápida.** Recomendado para el MVP.
2. **MapLibre GL** (open source, sin API key con tiles propios/MapTiler free) si el mapa demuestra
   valor. Es la opción "seria" para F3 (cafés) donde el mapa es el corazón del UX.
3. **Embed de Google Maps** (iframe) como punto intermedio sin dependencia JS.

**Regla:** ninguna feature *bloquea* su entrega esperando el mapa. El mapa es enhancement
progresivo sobre una lista que ya funciona. La incorporación de MapLibre se decide en un PR
propio y se documenta en `ARCHITECTURE.md`.

---

## F1 · Directorio de empresas tech (mapa del ecosistema)

**Por qué:** es el activo central B2B (Dealroom-style "find a partner") y el contenido que mejor
rankea para "empresas de software / IA en Mar del Plata". Es prueba social del polo.

**Rutas:**
- `/empresas` — listado + filtros (sector, tamaño, ¿contrata?, ¿exporta?, tecnología).
- `/empresas/[slug]` — ficha individual (server, estática/ISR → buena para SEO).

**Datos — Supabase `companies` (`scripts/014_companies.sql`):**

```
companies
  id              UUID PK default gen_random_uuid()
  slug            TEXT UNIQUE NOT NULL         -- para /empresas/[slug]
  name            TEXT NOT NULL
  tagline         TEXT
  description     TEXT
  logo_url        TEXT
  website         TEXT
  sectors         TEXT[]                        -- ['ia','fintech','salud','agro','gaming',...]
  tech_stack      TEXT[]
  size_bucket     TEXT  CHECK (size_bucket IN ('1-10','11-50','51-200','200+'))
  founded_year    INT
  is_hiring       BOOLEAN DEFAULT false
  exports         BOOLEAN DEFAULT false         -- exporta servicios
  neighborhood    TEXT                          -- barrio / "Distrito Tecnológico"
  lat, lng        DOUBLE PRECISION              -- opcional, para mapa futuro
  linkedin_url    TEXT
  is_aticma_member BOOLEAN DEFAULT false
  status          TEXT CHECK (status IN ('draft','published')) DEFAULT 'draft'
  submitted_by    UUID → profiles(id)           -- self-service futuro
  created_at, updated_at TIMESTAMPTZ
```

**RLS:**
- Lectura pública sólo de `status = 'published'` (vista `companies_public`).
- Escritura: admin (`is_admin()`). Self-service de empresas (insert como `draft`) es fase 2.

**Componentes:**
- `src/app/empresas/page.tsx` (server) → fetch `companies_public`.
- `src/components/empresas/CompanyDirectory.tsx` (client) → filtros + búsqueda.
- `src/components/empresas/CompanyCard.tsx`, `CompanyFilters.tsx`.
- `src/app/empresas/[slug]/page.tsx` (server, `generateStaticParams` + `generateMetadata`).
- Admin: tab nuevo en `AdminDashboard.tsx` (CRUD de empresas) reusando patrones de eventos.

**SEO:** JSON-LD `Organization` por ficha; `/empresas` con `ItemList`. Ver `04-seo.md`.

**Seed:** v1 cargada por admin con la data pública de ATICMA (+ pedir alta a las empresas).

**Estados vacíos:** si un filtro no matchea → CTA "¿Falta tu empresa? Sumala" → form/WhatsApp/ATICMA.

**Fases:** F1a directorio read-only (admin-seeded) → F1b filtros avanzados + JSON-LD →
F1c self-service (empresas se dan de alta) → F1d mapa (MapLibre).

---

## F2 · Agenda de eventos tech (ampliación de lo existente)

**Estado:** `/eventos` y la tabla `events` **ya existen**. Esta feature es **mejora**, no scratch.

**Mejoras propuestas:**
- Filtro por tipo (meetup/taller/charla/hackatón) y por mes; toggle próximos/pasados (ya hay base).
- **JSON-LD `Event`** por evento (gran win SEO: rich results de eventos). Ver `04-seo.md`.
- Feed `.ics` / "agregar a calendario" por evento.
- Vista destacada del "próximo evento" reutilizando `nextEvent` que ya calcula `page.tsx`.
- Para nómades: tag/filtro "en inglés" / "remote-friendly".

**Datos:** sin cambios de esquema obligatorios. Opcional: `events.format TEXT` ('presencial'|'online'|'hibrido')
y `events.lang TEXT[]`.

**Complejidad:** baja. Buen "primer PR" para validar pipeline. **Sin dependencia de F1.**

---

## F3 · Cafés y coworkings work-friendly

**Por qué:** feature estrella para nómades (alto volumen de búsqueda "cafe para trabajar Mar del
Plata", "coworking Mar del Plata"). Copia directa del patrón Freework/CoffeeCat (cap. 1).

**Rutas:**
- `/trabajar` — listado + filtros + (mapa fase 2).
- `/trabajar/[slug]` — ficha del lugar (server, SEO `LocalBusiness`).

**Datos — Supabase `work_spots` (`scripts/015_work_spots.sql`):**

```
work_spots
  id            UUID PK
  slug          TEXT UNIQUE NOT NULL
  name          TEXT NOT NULL
  kind          TEXT CHECK (kind IN ('cafe','coworking','biblioteca','hotel','otro'))
  description   TEXT
  address       TEXT
  neighborhood  TEXT
  lat, lng      DOUBLE PRECISION
  google_maps_url TEXT
  wifi_quality  SMALLINT CHECK (wifi_quality BETWEEN 1 AND 5)
  has_outlets   BOOLEAN
  noise_level   TEXT CHECK (noise_level IN ('silencioso','moderado','animado'))
  laptop_friendly BOOLEAN DEFAULT true          -- ¿te dejan quedarte a trabajar?
  price_level   SMALLINT CHECK (price_level BETWEEN 1 AND 3)   -- $/$$/$$$
  has_coworking_passes BOOLEAN DEFAULT false
  hours         JSONB                            -- horarios por día
  photo_url     TEXT
  amenities     TEXT[]                           -- ['enchufes','aire','patio','vegano',...]
  status        TEXT CHECK (status IN ('draft','published')) DEFAULT 'draft'
  submitted_by  UUID → profiles(id)
  created_at, updated_at TIMESTAMPTZ
```

**RLS:** lectura pública de `published` (vista `work_spots_public`). Escritura: admin + (fase 2)
sugerencias de la comunidad a `draft` que admin aprueba ("submit a place" del cap. 1).

**Componentes:** `WorkSpotMap` (fase 2, MapLibre), `WorkSpotList`, `WorkSpotCard`,
`WorkSpotFilters`, `SubmitSpotForm` (fase 2). Reusar tarjeta clara del design system.

**SEO:** `LocalBusiness` (o `CafeOrCoffeeShop`) JSON-LD por ficha; FAQ "¿hay wifi?/¿enchufes?".

**Fases:** F3a lista admin-seeded → F3b filtros + JSON-LD → F3c submit comunitario → F3d mapa.

---

## F4 · Guía para nómades (costo de vida, visa, internet, barrios)

**Por qué:** captura la query madre ("vivir / trabajar remoto desde Mar del Plata") y es el hub
que interlinkea F3, F5, F6, F7. Combina contenido editorial + **calculadora de costo de vida**
(el activo "linkeable" del cap. 1).

**Rutas (patrón Nomad List: dataset → varias intenciones):**
- `/vivir-en-mardelplata` — overview + índice.
- `/vivir-en-mardelplata/costo-de-vida` — desglose + **calculadora interactiva**.
- `/vivir-en-mardelplata/internet` — velocidad/proveedores.
- `/vivir-en-mardelplata/visa` — visa nómade Argentina (explicación + link a fuente oficial; **sin** checker propio).
- `/vivir-en-mardelplata/barrios` — guía de barrios (Centro, Güemes, La Perla, Constitución…).

**Datos:**
- **Contenido editorial** → JSON estático en `src/content/nomad/` (baja rotación, como
  `primer-trabajo`). Ej: `cost-of-living.json`, `neighborhoods.json`, `visa.json`.
- **Calculadora** → lógica en `src/lib/nomad/cost.ts`, estado en `localStorage` (patrón
  `primer-trabajo/persist.ts`), sin backend.
- Métricas con **fuente + fecha** embebidas (regla de credibilidad).

**Componentes:** `CostOfLivingCalculator` (client), `NeighborhoodGuide`, `StatCard` con fuente,
`ComparisonTable` (MdP vs BsAs / Lisboa — reusada por SEO en `04-seo.md`).

**Complejidad:** media (la calculadora). **Depende de** F7 (Roomix) sólo para el bloque de alquiler;
puede entregar con un placeholder y sumar Roomix después.

---

## F5 · Actividades turísticas / "qué hacer"

**Por qué:** completa el pitch lifestyle (el "calidad de vida costera" del posicionamiento) y suma
long-tail SEO. Es lo más liviano.

**Ruta:** `/que-hacer` (single page, secciones por categoría: playas, gastronomía, naturaleza,
cultura, deportes, escapadas). Contenido curado, **no** un TripAdvisor.

**Datos:** JSON estático `src/content/nomad/activities.json`. Sin Supabase.

**Componentes:** `ActivityGrid`, `ActivityCard`. Reusa tarjetas del design system.

**Ángulo:** "qué hacer cuando cerrás la laptop" — conecta con la narrativa nómade, no compite
con turismo tradicional.

**Complejidad:** baja. **Sin dependencias.**

---

## F6 · Instituciones educativas (carreras tech)

**Por qué:** argumento de "pipeline de talento" para empresas (Estonia/Ruta N lo destacan) y
recurso para quien evalúa formarse o relocarse con familia. MdP tiene 5 universidades con
carreras de economía del conocimiento.

**Ruta:** `/estudiar` (listado por institución → carreras tech, modalidad, link).

**Datos:** JSON estático `src/content/nomad/institutions.json` (baja rotación) **o** tabla
`institutions` si se quiere edición desde admin. Recomendado: **JSON** para v1.

**Componentes:** `InstitutionList`, `InstitutionCard` con carreras y tags (presencial/online).

**Complejidad:** baja. **Sin dependencias.**

---

## F7 · Integración con Roomix (alquileres)

**Contexto (research):** Roomix es un **metasearch inmobiliario con IA marplatense** (indexa
Zonaprop/Argenprop/MeLi/Properati), búsqueda conversacional, ~250k sesiones/mes, 4º sitio
inmobiliario de Argentina. **No tiene API pública documentada** para terceros (junio 2026).

**Implicancia:** la integración v1 es por **deep-linking**, no por API.

**Plan:**
- **F7a (ahora, sin API):** bloque "Encontrá dónde vivir" en `/vivir-en-mardelplata` que arma
  links a Roomix con la búsqueda pre-cargada (ej. "2 ambientes en Mar del Plata"), abriendo en
  `roomix.ai`. Un par de presets (temporario, anual, con vista al mar). UTM para medir tráfico.
  Lógica en `src/lib/integrations/roomix.ts` (builder de URLs, igual que `lib/huevsite.ts`/`urls.ts`).
- **F7b (si Roomix expone API/partnership):** widget embebido o cards de propiedades en vivo.
  Por ser startup local de la comunidad, **vale contactarlos** para un partnership oficial
  (co-marketing, embed dedicado). Acción no técnica → trackear en `05-agent-orchestration.md`.

**Riesgo/decisión:** confirmar parámetros de URL reales de Roomix antes de codear el builder
(inspección manual del sitio). Si cambian su esquema de URLs, el builder se actualiza en un punto.

**Complejidad:** baja (F7a) / media (F7b). **Depende de** F4 (vive adentro de la guía).

---

## F8 · Landing "Invertir / Invest in MdP" (B2B)

**Por qué:** el recorrido para empresas IT (playbook Ruta N / Invest in Estonia). Reúsa datos de
F1+F4+F6; no inventa dataset nuevo.

**Rutas:**
- `/invertir` (ES) y `/en/invest` (EN) — ver i18n en `04-seo.md`.

**Secciones:**
1. Hero con **claim de posicionamiento** + CTA "Hablemos" (contacto institucional).
2. **Métricas en vivo** (ATICMA: 200+ empresas, 10.000 talentos, USD 600M, 1er clúster IA) →
   componente `LiveStats` que lee de `city_stats` (JSON o tabla con fuente+fecha).
3. **Por qué MdP:** talento (F6), costo, calidad de vida (F5), Distrito Tecnológico, Ley de
   Economía del Conocimiento (explicar + link a organismo).
4. **Ecosistema:** embed del directorio F1 (logos + "ver todas").
5. **Casos faro:** Roomix y startups marplatenses que escalaron.
6. CTA dual: "Contactar" (form/WhatsApp institucional) + "Conocé ATICMA/Municipio".

**Datos:** `city_stats` (JSON `src/content/nomad/city-stats.json` con `value`, `label`, `source`, `as_of`).

**Componentes:** `InvestHero`, `LiveStats`, `WhyMdpGrid`, `EcosystemStrip` (reusa `CompanyCard`),
`FlagshipCases`, `InvestContact`.

**Complejidad:** media. **Depende de** F1 (para el strip de ecosistema; puede arrancar con logos
estáticos si F1 aún no está).

---

## F9 · Capa SEO (transversal)

Spec completa en `04-seo.md`. Resumen de lo que **toca código**:
- `src/app/sitemap.ts`, `src/app/robots.ts`, `metadataBase` en `layout.tsx`.
- Helpers JSON-LD en `src/lib/seo/` (Organization, Event, LocalBusiness, FAQPage, Breadcrumb).
- `generateMetadata` en cada ruta nueva (title/description/canonical/OG por entidad).
- i18n ES/EN (mínimo para F8 + landing nómade) con `hreflang`.
- Páginas comparativas (pSEO acotado): MdP vs {BsAs, Lisboa, Medellín…}.

---

## Matriz de resumen

| Feature | Ruta(s) | Almacenamiento | Nuevo client comp. | Depende de | Fase MVP |
|---|---|---|---|---|---|
| F2 Eventos+ | `/eventos` | `events` (existe) | filtros | — | ✅ primero |
| F5 Qué hacer | `/que-hacer` | JSON | grid | — | ✅ |
| F6 Estudiar | `/estudiar` | JSON | lista | — | ✅ |
| F3 Trabajar | `/trabajar` | `work_spots` | lista+filtros | — | ✅ |
| F4 Vivir | `/vivir-en-mardelplata/*` | JSON + `localStorage` | calculadora | F7 (parcial) | ✅ |
| F1 Empresas | `/empresas` | `companies` | dir+filtros | — | fase 2 |
| F7 Roomix | dentro de F4 | — (deep-link) | — | F4 | fase 2 |
| F8 Invertir | `/invertir`,`/en/invest` | JSON + reusa F1 | stats | F1 (parcial) | fase 2 |
| F9 SEO | transversal | — | — | rutas existan | continuo |

**Orden sugerido de MVP** (independientes y de bajo riesgo primero): F9-base (sitemap/robots/JSON-LD)
→ F2 → F5/F6 → F3 → F4(+F7a) → F1 → F8. Detalle y paralelización en `05-agent-orchestration.md`.
