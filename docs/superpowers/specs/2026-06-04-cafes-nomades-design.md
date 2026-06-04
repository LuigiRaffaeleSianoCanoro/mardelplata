# Cafés aptos a nómades digitales — Diseño

> Spec de la sección **"Recomendaciones de Cafés aptos a nómades digitales"** para `mardelplata.dev.ar`.
> Estado: aprobado en brainstorming (2026-06-04). Próximo paso: plan de implementación.

---

## 1. Overview

Nueva sección pública `/cafes` en la plataforma de la comunidad (Next.js 15 + Supabase) que
recomienda cafés de Mar del Plata aptos para trabajo remoto / nómades digitales. Cada café se
puntúa con un **lobito 🐺 arriba/abajo** (la mascota de la comunidad) por parte de los miembros
logueados, y se complementa con **chips opcionales** de comodidades (WiFi, enchufes, mesas/estadía,
silencio) y un **comentario corto** por miembro.

Los cafés base se **siembran una sola vez** desde la Google Places API (solo metadata del lugar);
toda la opinión la genera la comunidad. La lectura es pública (descubrible para quien visita la
ciudad + SEO); puntuar, marcar chips, comentar y agregar cafés requiere login.

## 2. Objetivos / No-objetivos

**Objetivos (v1)**
- Listado público de cafés ordenado por lobitos netos.
- Miembros logueados: lobito 🐺 arriba/abajo, chips de comodidades y comentario por café.
- Miembros logueados: agregar un café que no estaba sembrado.
- Semilla inicial vía Google Places API (metadata), corrida offline por el operador.
- Página de detalle compartible por café.

**No-objetivos (v1 — quedan para v2)**
- Scraping del texto de reviews de Google (descartado por ToS/fragilidad).
- NLP / análisis automático de reviews.
- Merge / dedup de cafés duplicados agregados por la comunidad.
- Flujo de aprobación/moderación previa (se publica al toque; admin puede borrar).
- Geolocalización / mapa interactivo embebido (solo link a Google Maps en v1).

## 3. Decisiones tomadas (brainstorming)

| Decisión | Resultado |
|---|---|
| Fuente de datos | Híbrido: Google Places API (semilla) + curaduría de la comunidad |
| Qué trae la semilla | Solo metadata del lugar (nombre, dirección, coords, rating Google, nº reviews) |
| Criterios "apto nómade" | WiFi · enchufes · mesas/estadía · ruido/ambiente |
| Forma de puntuar | **Un lobito 🐺 arriba/abajo por café** (binario, como el voto de la bolsa) |
| Los 4 ejes | Chips opcionales que el votante marca (no votos); se muestran como confirmaciones |
| Interacción | Ver + puntuar + comentar + agregar cafés |
| Ubicación | Ruta pública top-level `/cafes`, entrada en el navbar |
| Detalle | Ruta compartible `/cafes/[id]` (no modal) |
| Seed | Script Node standalone en `scripts/`, fuera del deploy |

## 4. Modelo de datos (Supabase)

Migración nueva `scripts/006_cafes.sql`, a correr en el SQL Editor de Supabase (convención del repo).
Sigue el estilo de `scripts/003_classified_listings.sql`.

### 4.1 Tabla `cafes`

```
id                   UUID PK DEFAULT gen_random_uuid()
name                 TEXT NOT NULL
address              TEXT
neighborhood         TEXT                       -- barrio (filtro)
lat                  DOUBLE PRECISION
lng                  DOUBLE PRECISION
google_place_id      TEXT UNIQUE                -- null si lo agregó la comunidad
google_rating        NUMERIC                    -- del seed (contexto)
google_reviews_count INTEGER
maps_url             TEXT
source               TEXT NOT NULL CHECK (source IN ('seed','community'))
added_by             UUID REFERENCES public.profiles(id) ON DELETE SET NULL  -- null para seed
created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
```
Índices: `google_place_id` (UNIQUE), `neighborhood`, `source`, `added_by`.
Trigger `set_cafes_updated_at` (mismo patrón que `set_profiles_updated_at`).

### 4.2 Tabla `cafe_votes`

Una fila por miembro por café (calca `classified_votes` + extras de comodidades/comentario).

```
cafe_id      UUID NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE
user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
vote         SMALLINT NOT NULL CHECK (vote IN (1,-1))   -- 🐺 lobito arriba/abajo
has_wifi     BOOLEAN                                    -- chips opcionales (nullable)
has_power    BOOLEAN
good_seating BOOLEAN
is_quiet     BOOLEAN
comment      TEXT                                       -- mini-review opcional (máx ~600 chars, validado en cliente)
created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
PRIMARY KEY (cafe_id, user_id)                          -- upsert: el miembro edita su propia fila
```
Índice: `cafe_id`. Trigger `set_cafe_votes_updated_at`.

### 4.3 Vista `cafe_scores`

Agrega los votos para no traer todas las filas al browser. Lectura pública.

```
cafe_id,
net_votes      = COALESCE(SUM(vote), 0),
up_count       = COUNT(*) FILTER (WHERE vote = 1),
down_count     = COUNT(*) FILTER (WHERE vote = -1),
votes_count    = COUNT(*),
wifi_count     = COUNT(*) FILTER (WHERE has_wifi),
power_count    = COUNT(*) FILTER (WHERE has_power),
seating_count  = COUNT(*) FILTER (WHERE good_seating),
quiet_count    = COUNT(*) FILTER (WHERE is_quiet)
GROUP BY cafe_id
```
Definir con `security_invoker = true` (las tablas subyacentes son de lectura pública).
Orden por defecto del listado: `net_votes DESC, votes_count DESC`.
Cada chip se renderiza como "N confirman WiFi", etc.

## 5. Row Level Security

Todas las tablas con RLS habilitado (convención del repo). Helper existente `public.is_admin()`.

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `cafes` | Público (anon + auth) | Auth, `added_by = auth.uid()` y `source='community'` | Dueño (`added_by`) o `is_admin()` | Dueño o `is_admin()` |
| `cafe_votes` | Público | Auth, `user_id = auth.uid()` | `user_id = auth.uid()` | `user_id = auth.uid()` |

- La vista `cafe_scores` hereda la lectura pública.
- El **seed** entra con la **service-role key** (saltea RLS); por eso `source='seed'` no se puede
  insertar vía policies de usuario.
- `GRANT`: `SELECT` a `anon, authenticated` en `cafes`/`cafe_votes`/`cafe_scores`;
  `INSERT/UPDATE/DELETE` a `authenticated` según corresponda.

## 6. Rutas y componentes (calcando el patrón `bolsa`)

```
src/app/cafes/
  layout.tsx              # metadata (título, descripción, OG)
  page.tsx                # RSC: fetch cafes + cafe_scores (server client) → hidrata CafesClient
  [id]/page.tsx           # RSC: detalle compartible de un café (SEO + links)

src/components/cafes/
  CafesClient.tsx         # grid + filtros (barrio, "con WiFi confirmado", orden) — "use client"
  CafeCard.tsx            # nombre, barrio, lobitos netos, chips confirmados
  CafeDetail.tsx          # render del detalle (usado por [id]/page.tsx)
  VoteWolf.tsx            # 🐺 arriba/abajo + chips + comentario (logueado) / CTA login (anon)
  AddCafeForm.tsx         # alta de café por la comunidad

src/lib/types/cafes.ts    # tipos (Cafe, CafeVote, CafeScore, CafeWithScore)
```

- `Navbar.tsx`: agregar entrada **"Cafés ☕"**.
- Modelo de rendering: `/cafes` y `/cafes/[id]` son **RSC** que leen de Supabase con el server
  client (lectura pública → SEO + primer paint); la interactividad (votar, chips, comentar, alta,
  filtros) vive en componentes `"use client"` que usan el browser client.
- CTA "Iniciá sesión" para anónimos (patrón ya existente en la bolsa, commit `eeb4e85`).
- Sin librerías de UI nuevas (el repo no usa shadcn/Radix; íconos SVG inline). El lobito reutiliza
  el asset/ícono de marca de la comunidad.

## 7. Seed (fuera del deploy)

`scripts/seed-cafes.mjs` — script Node standalone, **no se despliega**, lo corre el operador a mano
(igual que el SQL del SQL Editor).

- Fuente: Google Places API — Text Search (`"café en Mar del Plata"` + paginación con `next_page_token`)
  y Place Details para metadata por lugar.
- Destino: upsert en `public.cafes` vía cliente Supabase con **service-role key**.
- Idempotente por `google_place_id` (`ON CONFLICT (google_place_id) DO UPDATE` de
  `google_rating`, `google_reviews_count`, `updated_at`).
- Flags: `--dry-run` (imprime sin escribir), límite de resultados.
- Env: `GOOGLE_PLACES_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`.
- Documentar uso en `README.md`. La service-role key **nunca** se commitea ni llega al cliente.

## 8. Manejo de errores

- **Sitio**: si los queries a Supabase fallan, degradan a estado vacío (igual que el resto de la
  app — los datos quedan en `[]`, sin romper el render). Estados vacíos explícitos: "todavía no hay
  cafés", "sé el primero en recomendar".
- **Voto/alta**: validación en cliente (largo de comentario, campos requeridos del alta); errores de
  Supabase se muestran inline. El upsert del voto evita duplicados por PK `(cafe_id, user_id)`.
- **Seed**: maneja rate limits / errores de la API (reintentos con backoff, saltea y loguea los que
  fallan), reporta resumen al final. `--dry-run` para validar antes de escribir.

## 9. Moderación

- Cafés de comunidad se publican **al toque**, con badge "agregado por la comunidad".
- Admins (`is_admin()`) pueden borrar cafés y votos.
- Dedup garantizado solo para seed (por `google_place_id`). Duplicados de comunidad: riesgo
  asumido en v1; merge/dedup queda para v2.

## 10. Verificación

El repo no tiene test harness (solo `next lint`). Verificación de la feature:
- `next build` y `next lint` sin errores.
- QA manual: anónimo (ve listado/detalle, CTA login), logueado (vota 🐺, marca chips, comenta,
  edita su voto, agrega café), filtros y orden.
- `node scripts/seed-cafes.mjs --dry-run` con una API key válida.
- Actualizar `ARCHITECTURE.md` (secciones de rutas y de schema Supabase) **en el mismo PR**, como
  pide la convención del repo.

## 11. Secuencia de build sugerida

1. `scripts/006_cafes.sql` — tablas, vista, RLS, triggers, grants. Correr en Supabase.
2. `src/lib/types/cafes.ts` — tipos.
3. `/cafes/page.tsx` + `CafesClient` + `CafeCard` — listado de solo-lectura (con datos sembrados a mano para probar).
4. `VoteWolf` — lobito + chips + comentario (escritura logueada).
5. `/cafes/[id]/page.tsx` + `CafeDetail` — detalle.
6. `AddCafeForm` — alta de comunidad.
7. `Navbar` — entrada "Cafés ☕".
8. `scripts/seed-cafes.mjs` + doc en README.
9. Actualizar `ARCHITECTURE.md`.
