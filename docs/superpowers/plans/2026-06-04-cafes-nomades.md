# Cafés aptos a nómades digitales — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar una sección pública `/cafes` a `mardelplata.dev.ar` que recomienda cafés aptos para nómades digitales en Mar del Plata, con voto 🐺 (lobito arriba/abajo) por miembro, chips de comodidades, comentarios y alta comunitaria; sembrada una vez vía Google Places API.

**Architecture:** Next.js 15 App Router. Las páginas `/cafes` y `/cafes/[id]` son RSC que leen de Supabase con el server client (lectura pública → SEO + primer paint); la interactividad vive en componentes `"use client"` que usan el browser client, calcando el patrón de `bolsa`. Datos en dos tablas Supabase (`cafes`, `cafe_votes`) + vista de agregación (`cafe_scores`), todas con RLS. El seed corre offline como script Node con service-role key.

**Tech Stack:** Next.js 15, React 19, TypeScript 5 (strict), Supabase (`@supabase/ssr`, `@supabase/supabase-js`), Tailwind v4. Sin librerías de UI nuevas. Verificación: `npm run lint`, `npm run build`, QA manual, `node --test` para el helper puro del seed.

**Spec:** `docs/superpowers/specs/2026-06-04-cafes-nomades-design.md`

**Nota sobre testing:** el repo no tiene framework de tests (solo `next lint`). Este plan usa `npm run lint` + `npm run build` + QA manual + queries SQL como verificación, y `node --test` (runner nativo, sin dependencias) solo para la lógica pura del seed. No inventamos un framework de tests para componentes React.

**Nota de git:** trabajar en la rama `feat/cafes-nomades` (ya creada, contiene el spec commiteado). El working tree puede tener WIP flotante de otra rama — al hacer `git add` usar siempre rutas explícitas de los archivos de cada tarea, nunca `git add -A`/`git add .`.

---

### Task 1: Migración SQL — tablas, vista, RLS, triggers

**Files:**
- Create: `scripts/012_cafes.sql`

> Numeración: el último script del repo es `011_profiles_no_escalation.sql`, así que esta migración es la **012**. (No usar `006` — ya existe `006_red.sql`.)

- [ ] **Step 1: Escribir la migración completa**

Crear `scripts/012_cafes.sql` con este contenido exacto (sigue el estilo de `scripts/003_classified_listings.sql`):

```sql
-- Cafés aptos a nómades digitales (cafés + votos lobito + comodidades)
-- Ejecutar en el SQL editor de Supabase (o como migración).

CREATE TABLE IF NOT EXISTS public.cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  neighborhood TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  google_place_id TEXT UNIQUE,
  google_rating NUMERIC,
  google_reviews_count INTEGER,
  maps_url TEXT,
  source TEXT NOT NULL CHECK (source IN ('seed', 'community')),
  added_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cafes_neighborhood ON public.cafes (neighborhood);
CREATE INDEX IF NOT EXISTS idx_cafes_source ON public.cafes (source);
CREATE INDEX IF NOT EXISTS idx_cafes_added_by ON public.cafes (added_by);

CREATE TABLE IF NOT EXISTS public.cafe_votes (
  cafe_id UUID NOT NULL REFERENCES public.cafes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (1, -1)),
  has_wifi BOOLEAN,
  has_power BOOLEAN,
  good_seating BOOLEAN,
  is_quiet BOOLEAN,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (cafe_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cafe_votes_cafe ON public.cafe_votes (cafe_id);

-- Vista de agregación (lectura pública vía security_invoker sobre tablas públicas)
CREATE OR REPLACE VIEW public.cafe_scores
WITH (security_invoker = true) AS
SELECT
  c.id AS cafe_id,
  COALESCE(SUM(v.vote), 0)                              AS net_votes,
  COUNT(*) FILTER (WHERE v.vote = 1)                    AS up_count,
  COUNT(*) FILTER (WHERE v.vote = -1)                   AS down_count,
  COUNT(v.user_id)                                      AS votes_count,
  COUNT(*) FILTER (WHERE v.has_wifi)                    AS wifi_count,
  COUNT(*) FILTER (WHERE v.has_power)                   AS power_count,
  COUNT(*) FILTER (WHERE v.good_seating)                AS seating_count,
  COUNT(*) FILTER (WHERE v.is_quiet)                    AS quiet_count
FROM public.cafes c
LEFT JOIN public.cafe_votes v ON v.cafe_id = c.id
GROUP BY c.id;

-- Triggers updated_at (reusa el patrón set_*_updated_at del repo).
-- La función public.set_updated_at() ya existe en el esquema (la usan profiles/events).
-- Si no existiera en tu entorno, crearla:
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_cafes_updated_at ON public.cafes;
CREATE TRIGGER set_cafes_updated_at
  BEFORE UPDATE ON public.cafes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_cafe_votes_updated_at ON public.cafe_votes;
CREATE TRIGGER set_cafe_votes_updated_at
  BEFORE UPDATE ON public.cafe_votes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_votes ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.cafes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cafes TO authenticated;
GRANT SELECT ON public.cafe_votes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cafe_votes TO authenticated;
GRANT SELECT ON public.cafe_scores TO anon, authenticated;

-- cafes: lectura pública
DROP POLICY IF EXISTS "cafes_select" ON public.cafes;
CREATE POLICY "cafes_select" ON public.cafes
  FOR SELECT USING (true);

-- cafes: alta solo logueado, como community y a nombre propio
DROP POLICY IF EXISTS "cafes_insert" ON public.cafes;
CREATE POLICY "cafes_insert" ON public.cafes
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND source = 'community'
    AND added_by = auth.uid()
  );

-- cafes: editar/borrar dueño o admin
DROP POLICY IF EXISTS "cafes_update" ON public.cafes;
CREATE POLICY "cafes_update" ON public.cafes
  FOR UPDATE USING (added_by = auth.uid() OR public.is_admin())
  WITH CHECK (added_by = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "cafes_delete" ON public.cafes;
CREATE POLICY "cafes_delete" ON public.cafes
  FOR DELETE USING (added_by = auth.uid() OR public.is_admin());

-- cafe_votes: lectura pública
DROP POLICY IF EXISTS "cafe_votes_select" ON public.cafe_votes;
CREATE POLICY "cafe_votes_select" ON public.cafe_votes
  FOR SELECT USING (true);

-- cafe_votes: escribir/editar/borrar solo el voto propio
DROP POLICY IF EXISTS "cafe_votes_insert" ON public.cafe_votes;
CREATE POLICY "cafe_votes_insert" ON public.cafe_votes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND user_id = auth.uid());

DROP POLICY IF EXISTS "cafe_votes_update" ON public.cafe_votes;
CREATE POLICY "cafe_votes_update" ON public.cafe_votes
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "cafe_votes_delete" ON public.cafe_votes;
CREATE POLICY "cafe_votes_delete" ON public.cafe_votes
  FOR DELETE USING (user_id = auth.uid());
```

- [ ] **Step 2: Ejecutar la migración en Supabase**

Pegar el contenido de `scripts/012_cafes.sql` en el SQL Editor del proyecto Supabase y ejecutar.
Esperado: "Success. No rows returned".

- [ ] **Step 3: Verificar tablas, vista y RLS**

Ejecutar en el SQL Editor:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('cafes','cafe_votes');
SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('cafes','cafe_votes');
SELECT * FROM public.cafe_scores LIMIT 1;
INSERT INTO public.cafes (name, source) VALUES ('Café de prueba', 'seed');
SELECT id, name, source, created_at FROM public.cafes;
```
Esperado: las dos tablas listadas; `relrowsecurity = true` en ambas; `cafe_scores` devuelve 0 filas sin error; el INSERT manual (corre como rol del editor, no como policy) crea 1 fila visible.

- [ ] **Step 4: Commit**

```bash
git add scripts/012_cafes.sql
git commit -m "feat(cafes): migración SQL — tablas cafes/cafe_votes + vista cafe_scores + RLS"
```

---

### Task 2: Tipos TypeScript

**Files:**
- Create: `src/lib/types/cafes.ts`

- [ ] **Step 1: Escribir los tipos**

Crear `src/lib/types/cafes.ts`:

```ts
export type CafeSource = "seed" | "community";

export interface Cafe {
  id: string;
  name: string;
  address: string | null;
  neighborhood: string | null;
  lat: number | null;
  lng: number | null;
  google_place_id: string | null;
  google_rating: number | null;
  google_reviews_count: number | null;
  maps_url: string | null;
  source: CafeSource;
  added_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CafeScore {
  cafe_id: string;
  net_votes: number;
  up_count: number;
  down_count: number;
  votes_count: number;
  wifi_count: number;
  power_count: number;
  seating_count: number;
  quiet_count: number;
}

export const EMPTY_SCORE: Omit<CafeScore, "cafe_id"> = {
  net_votes: 0,
  up_count: 0,
  down_count: 0,
  votes_count: 0,
  wifi_count: 0,
  power_count: 0,
  seating_count: 0,
  quiet_count: 0,
};

export interface CafeWithScore extends Cafe {
  score: Omit<CafeScore, "cafe_id">;
}

// La fila de voto del miembro actual (su propio voto + chips + comentario).
export interface CafeVote {
  cafe_id: string;
  user_id: string;
  vote: 1 | -1;
  has_wifi: boolean | null;
  has_power: boolean | null;
  good_seating: boolean | null;
  is_quiet: boolean | null;
  comment: string | null;
}

// Comentario de la comunidad mostrado en el detalle.
export interface CafeComment {
  user_id: string;
  vote: 1 | -1;
  comment: string;
  author_name: string | null;
}

export const CAFE_NAME_MAX = 120;
export const CAFE_COMMENT_MAX = 600;

// Definición de los chips de comodidades. La key matchea columnas de cafe_votes
// y de cafe_scores (con sufijo _count).
export const CAFE_AMENITIES = [
  { key: "has_wifi", countKey: "wifi_count", label: "WiFi", emoji: "📶" },
  { key: "has_power", countKey: "power_count", label: "Enchufes", emoji: "🔌" },
  { key: "good_seating", countKey: "seating_count", label: "Mesas/estadía", emoji: "🪑" },
  { key: "is_quiet", countKey: "quiet_count", label: "Tranquilo", emoji: "🔇" },
] as const;

export type AmenityKey = (typeof CAFE_AMENITIES)[number]["key"];
```

- [ ] **Step 2: Verificar que typechequea**

Run: `npm run lint`
Esperado: sin errores nuevos en `src/lib/types/cafes.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types/cafes.ts
git commit -m "feat(cafes): tipos TypeScript (Cafe, CafeScore, CafeVote, amenities)"
```

---

### Task 3: Listado público (RSC + cliente de solo lectura)

**Files:**
- Create: `src/app/cafes/layout.tsx`
- Create: `src/app/cafes/page.tsx`
- Create: `src/components/cafes/CafesClient.tsx`
- Create: `src/components/cafes/CafeCard.tsx`
- Modify: `src/app/globals.css` (agregar bloque `cafes-*` al final)

- [ ] **Step 1: Layout con metadata**

Crear `src/app/cafes/layout.tsx` (calca `src/app/bolsa/layout.tsx`):

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cafés para nómades — mardelplata.dev.ar",
  description:
    "Recomendaciones de cafés de Mar del Plata aptos para trabajo remoto: WiFi, enchufes, mesas y ambiente, votados por la comunidad.",
};

export default function CafesLayout({ children }: { children: React.ReactNode }) {
  return <div className="cafes-root min-h-screen font-sans antialiased">{children}</div>;
}
```

- [ ] **Step 2: Página RSC que lee cafés + scores y los mergea**

Crear `src/app/cafes/page.tsx`. Lee de Supabase con el server client (lectura pública), mergea por `cafe_id`, ordena por `net_votes` y pasa el array al cliente:

```tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CafesClient from "@/components/cafes/CafesClient";
import { createClient } from "@/lib/supabase/server";
import { EMPTY_SCORE, type Cafe, type CafeScore, type CafeWithScore } from "@/lib/types/cafes";

export const dynamic = "force-dynamic";

export default async function CafesPage() {
  const supabase = await createClient();

  const { data: cafesRaw } = await supabase
    .from("cafes")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: scoresRaw } = await supabase.from("cafe_scores").select("*");

  const scoreMap = new Map<string, Omit<CafeScore, "cafe_id">>();
  for (const s of (scoresRaw ?? []) as CafeScore[]) {
    const { cafe_id, ...rest } = s;
    scoreMap.set(cafe_id, rest);
  }

  const cafes: CafeWithScore[] = ((cafesRaw ?? []) as Cafe[])
    .map((c) => ({ ...c, score: scoreMap.get(c.id) ?? EMPTY_SCORE }))
    .sort(
      (a, b) =>
        b.score.net_votes - a.score.net_votes ||
        b.score.votes_count - a.score.votes_count,
    );

  return (
    <>
      <Navbar />
      <main className="cafes-x">
        <CafesClient initialCafes={cafes} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: CafeCard (presentacional)**

Crear `src/components/cafes/CafeCard.tsx`. Muestra nombre, barrio, lobitos netos y chips confirmados. El voto se cablea en la Task 4 (acá `onVote`/`myVote` ya existen pero los rellena el cliente):

```tsx
"use client";

import { CAFE_AMENITIES, type CafeWithScore } from "@/lib/types/cafes";

interface Props {
  cafe: CafeWithScore;
  myVote: 1 | -1 | null;
  onOpen: () => void;
  onVote: (dir: 1 | -1) => void;
  canVote: boolean;
}

export default function CafeCard({ cafe, myVote, onOpen, onVote, canVote }: Props) {
  const { score } = cafe;
  return (
    <article className="cafes-x-card">
      <button type="button" className="cafes-x-card-body" onClick={onOpen}>
        <h3 className="cafes-x-card-title">{cafe.name}</h3>
        {cafe.neighborhood && <p className="cafes-x-card-hood">{cafe.neighborhood}</p>}
        <div className="cafes-x-chips">
          {CAFE_AMENITIES.map((a) => {
            const n = score[a.countKey];
            if (!n) return null;
            return (
              <span key={a.key} className="cafes-x-chip" title={`${n} confirman ${a.label}`}>
                {a.emoji} {a.label} · {n}
              </span>
            );
          })}
        </div>
        {cafe.source === "community" && (
          <span className="cafes-x-badge">agregado por la comunidad</span>
        )}
      </button>
      <div className="cafes-x-vote">
        <button
          type="button"
          aria-label="Lobito arriba"
          disabled={!canVote}
          className={`cafes-x-wolf ${myVote === 1 ? "is-up" : ""}`}
          onClick={() => onVote(1)}
        >
          🐺▲
        </button>
        <span className="cafes-x-net">{score.net_votes}</span>
        <button
          type="button"
          aria-label="Lobito abajo"
          disabled={!canVote}
          className={`cafes-x-wolf ${myVote === -1 ? "is-down" : ""}`}
          onClick={() => onVote(-1)}
        >
          🐺▼
        </button>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: CafesClient (solo lectura + filtros, sin escritura todavía)**

Crear `src/components/cafes/CafesClient.tsx`. Recibe `initialCafes` del RSC, maneja filtros por barrio y orden. La sesión y el voto se agregan en la Task 4; por ahora `canVote=false` y `onVote` es no-op:

```tsx
"use client";

import { useMemo, useState } from "react";
import type { CafeWithScore } from "@/lib/types/cafes";
import CafeCard from "./CafeCard";

interface Props {
  initialCafes: CafeWithScore[];
}

export default function CafesClient({ initialCafes }: Props) {
  const [cafes] = useState<CafeWithScore[]>(initialCafes);
  const [hood, setHood] = useState<string>("all");
  const [onlyWifi, setOnlyWifi] = useState(false);

  const hoods = useMemo(() => {
    const set = new Set<string>();
    for (const c of cafes) if (c.neighborhood) set.add(c.neighborhood);
    return Array.from(set).sort();
  }, [cafes]);

  const filtered = useMemo(() => {
    return cafes.filter((c) => {
      if (hood !== "all" && c.neighborhood !== hood) return false;
      if (onlyWifi && c.score.wifi_count === 0) return false;
      return true;
    });
  }, [cafes, hood, onlyWifi]);

  return (
    <div className="shell-section">
      <div className="shell-inner">
        <header className="cafes-x-header">
          <div>
            <p className="shell-eyebrow">CAFÉS · NÓMADES</p>
            <h1 className="shell-title">Cafés para <em>trabajar.</em></h1>
            <p className="shell-lead" style={{ marginTop: "0.6rem" }}>
              Recomendaciones de la comunidad: dónde hay buen WiFi, enchufes y lugar para abrir la laptop en Mar del Plata.
            </p>
          </div>
          <div className="cafes-x-filter">
            <select
              aria-label="Filtrar por barrio"
              className="cafes-x-select"
              value={hood}
              onChange={(e) => setHood(e.target.value)}
            >
              <option value="all">Todos los barrios</option>
              {hoods.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <label className="cafes-x-toggle">
              <input
                type="checkbox"
                checked={onlyWifi}
                onChange={(e) => setOnlyWifi(e.target.checked)}
              />
              Con WiFi confirmado
            </label>
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="cafes-x-empty">
            Todavía no hay cafés cargados. ¡Sé el primero en recomendar uno!
          </p>
        ) : (
          <div className="cafes-x-grid">
            {filtered.map((c) => (
              <CafeCard
                key={c.id}
                cafe={c}
                myVote={null}
                canVote={false}
                onOpen={() => {
                  window.location.href = `/cafes/${c.id}`;
                }}
                onVote={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Estilos**

Agregar al final de `src/app/globals.css`:

```css
/* ---- Cafés para nómades ---- */
.cafes-x-header { display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
.cafes-x-filter { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
.cafes-x-select { background: rgba(255,255,255,0.05); color: inherit; border: 1px solid rgba(255,255,255,0.15); border-radius: 0.5rem; padding: 0.4rem 0.7rem; }
.cafes-x-toggle { display: inline-flex; gap: 0.4rem; align-items: center; font-size: 0.85rem; opacity: 0.85; }
.cafes-x-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
.cafes-x-card { display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.12); border-radius: 1rem; overflow: hidden; background: rgba(255,255,255,0.03); }
.cafes-x-card-body { text-align: left; padding: 1.1rem; background: none; border: none; color: inherit; cursor: pointer; flex: 1; }
.cafes-x-card-title { font-weight: 600; font-size: 1.1rem; }
.cafes-x-card-hood { opacity: 0.7; font-size: 0.85rem; margin-top: 0.2rem; }
.cafes-x-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.8rem; }
.cafes-x-chip { font-size: 0.75rem; padding: 0.2rem 0.55rem; border-radius: 999px; background: rgba(255,255,255,0.08); }
.cafes-x-badge { display: inline-block; margin-top: 0.8rem; font-size: 0.7rem; opacity: 0.6; }
.cafes-x-vote { display: flex; align-items: center; justify-content: center; gap: 0.9rem; padding: 0.6rem; border-top: 1px solid rgba(255,255,255,0.1); }
.cafes-x-wolf { background: none; border: none; cursor: pointer; font-size: 1rem; opacity: 0.6; }
.cafes-x-wolf:disabled { cursor: default; opacity: 0.35; }
.cafes-x-wolf.is-up { opacity: 1; filter: drop-shadow(0 0 4px rgba(80,220,120,0.7)); }
.cafes-x-wolf.is-down { opacity: 1; filter: drop-shadow(0 0 4px rgba(220,90,90,0.7)); }
.cafes-x-net { font-weight: 700; min-width: 2ch; text-align: center; }
.cafes-x-empty { opacity: 0.7; padding: 3rem 0; text-align: center; }
```

- [ ] **Step 6: Sembrar 2 cafés de prueba en Supabase**

En el SQL Editor:

```sql
INSERT INTO public.cafes (name, neighborhood, source, maps_url) VALUES
  ('Café del Faro', 'Playa Grande', 'seed', 'https://maps.google.com/?q=cafe'),
  ('La Estación Coffee', 'Centro', 'community', null);
```

- [ ] **Step 7: Verificar listado en el navegador**

Run: `npm run dev` y abrir `http://localhost:3000/cafes` (sin loguearse).
Esperado: se ven las 2 tarjetas, el filtro de barrios lista "Playa Grande" y "Centro", el toggle "Con WiFi confirmado" deja la lista vacía (no hay votos aún), los lobitos aparecen deshabilitados. Clic en una tarjeta navega a `/cafes/<id>` (404 hasta la Task 5 — esperado).

- [ ] **Step 8: Lint + build**

Run: `npm run lint && npm run build`
Esperado: sin errores.

- [ ] **Step 9: Commit**

```bash
git add src/app/cafes/layout.tsx src/app/cafes/page.tsx src/components/cafes/CafesClient.tsx src/components/cafes/CafeCard.tsx src/app/globals.css
git commit -m "feat(cafes): listado público /cafes (RSC + filtros + tarjetas)"
```

---

### Task 4: Voto 🐺 + chips + comentario (escritura logueada)

**Files:**
- Modify: `src/components/cafes/CafesClient.tsx`
- Create: `src/components/cafes/VoteWolf.tsx`

- [ ] **Step 1: VoteWolf — panel de voto del miembro**

Crear `src/components/cafes/VoteWolf.tsx`. Muestra el lobito arriba/abajo, los 4 chips toggleables y un comentario; persiste vía upsert en `cafe_votes`. Para anónimos muestra CTA de login:

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CAFE_AMENITIES,
  CAFE_COMMENT_MAX,
  type AmenityKey,
  type CafeVote,
} from "@/lib/types/cafes";

interface Props {
  cafeId: string;
  userId: string | null;
  onChanged?: () => void;
}

type Draft = {
  vote: 1 | -1 | null;
  has_wifi: boolean;
  has_power: boolean;
  good_seating: boolean;
  is_quiet: boolean;
  comment: string;
};

const EMPTY_DRAFT: Draft = {
  vote: null,
  has_wifi: false,
  has_power: false,
  good_seating: false,
  is_quiet: false,
  comment: "",
};

export default function VoteWolf({ cafeId, userId, onChanged }: Props) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void supabase
      .from("cafe_votes")
      .select("*")
      .eq("cafe_id", cafeId)
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const v = data as CafeVote;
        setDraft({
          vote: v.vote,
          has_wifi: !!v.has_wifi,
          has_power: !!v.has_power,
          good_seating: !!v.good_seating,
          is_quiet: !!v.is_quiet,
          comment: v.comment ?? "",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [cafeId, userId, supabase]);

  if (!userId) {
    return (
      <div className="cafes-x-gate">
        <p className="shell-lead">Iniciá sesión para votar 🐺 y comentar.</p>
        <div className="cafes-x-gate-actions">
          <a href="/auth/login" className="shell-btn-primary">Ingresar →</a>
          <a href="/auth/registro" className="shell-btn-ghost">Crear cuenta</a>
        </div>
      </div>
    );
  }

  const toggleAmenity = (k: AmenityKey) =>
    setDraft((d) => ({ ...d, [k]: !d[k] }));

  const save = async (vote: 1 | -1) => {
    setSaving(true);
    setError(null);
    const next: Draft = { ...draft, vote };
    setDraft(next);
    const { error: err } = await supabase.from("cafe_votes").upsert(
      {
        cafe_id: cafeId,
        user_id: userId,
        vote,
        has_wifi: next.has_wifi,
        has_power: next.has_power,
        good_seating: next.good_seating,
        is_quiet: next.is_quiet,
        comment: next.comment.trim() || null,
      },
      { onConflict: "cafe_id,user_id" },
    );
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onChanged?.();
  };

  return (
    <div className="cafes-x-voteform">
      <div className="cafes-x-vote">
        <button
          type="button"
          aria-label="Lobito arriba"
          className={`cafes-x-wolf ${draft.vote === 1 ? "is-up" : ""}`}
          disabled={saving}
          onClick={() => void save(1)}
        >
          🐺▲ Apto
        </button>
        <button
          type="button"
          aria-label="Lobito abajo"
          className={`cafes-x-wolf ${draft.vote === -1 ? "is-down" : ""}`}
          disabled={saving}
          onClick={() => void save(-1)}
        >
          🐺▼ No apto
        </button>
      </div>

      <div className="cafes-x-chips">
        {CAFE_AMENITIES.map((a) => (
          <button
            key={a.key}
            type="button"
            className={`cafes-x-chip ${draft[a.key] ? "is-on" : ""}`}
            onClick={() => toggleAmenity(a.key)}
          >
            {a.emoji} {a.label}
          </button>
        ))}
      </div>

      <textarea
        className="cafes-x-comment"
        maxLength={CAFE_COMMENT_MAX}
        placeholder="Tu mini-review (opcional)…"
        value={draft.comment}
        onChange={(e) => setDraft((d) => ({ ...d, comment: e.target.value }))}
        onBlur={() => {
          if (draft.vote) void save(draft.vote);
        }}
      />

      {error && <p className="cafes-x-errmsg">Error al guardar: {error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Estilos del panel de voto**

Agregar al final de `src/app/globals.css`:

```css
.cafes-x-voteform { display: flex; flex-direction: column; gap: 0.9rem; }
.cafes-x-chip.is-on { background: rgba(80,180,255,0.25); outline: 1px solid rgba(80,180,255,0.5); }
.cafes-x-comment { width: 100%; min-height: 4rem; background: rgba(255,255,255,0.05); color: inherit; border: 1px solid rgba(255,255,255,0.15); border-radius: 0.6rem; padding: 0.6rem; resize: vertical; }
.cafes-x-gate { padding: 1.5rem; border: 1px dashed rgba(255,255,255,0.2); border-radius: 0.8rem; }
.cafes-x-gate-actions { display: flex; gap: 0.8rem; margin-top: 0.8rem; }
.cafes-x-errmsg { color: #ff8080; font-size: 0.85rem; }
```

- [ ] **Step 3: Cablear sesión y voto-en-tarjeta en CafesClient**

Modificar `src/components/cafes/CafesClient.tsx`. Cargar el usuario y su mapa de votos propios; permitir voto rápido desde la tarjeta (sin chips, solo dirección). Reemplazar el contenido por:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { CafeWithScore } from "@/lib/types/cafes";
import CafeCard from "./CafeCard";

interface Props {
  initialCafes: CafeWithScore[];
}

export default function CafesClient({ initialCafes }: Props) {
  const [cafes, setCafes] = useState<CafeWithScore[]>(initialCafes);
  const [user, setUser] = useState<User | null>(null);
  const [myVotes, setMyVotes] = useState<Map<string, 1 | -1>>(new Map());
  const [hood, setHood] = useState<string>("all");
  const [onlyWifi, setOnlyWifi] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const reloadScores = useCallback(async () => {
    const { data } = await supabase.from("cafe_scores").select("*");
    if (!data) return;
    const map = new Map<string, CafeWithScore["score"]>();
    for (const s of data) {
      const { cafe_id, ...rest } = s as CafeWithScore["score"] & { cafe_id: string };
      map.set(cafe_id, rest);
    }
    setCafes((prev) =>
      prev
        .map((c) => ({ ...c, score: map.get(c.id) ?? c.score }))
        .sort(
          (a, b) =>
            b.score.net_votes - a.score.net_votes ||
            b.score.votes_count - a.score.votes_count,
        ),
    );
  }, [supabase]);

  const loadMyVotes = useCallback(
    async (uid: string) => {
      const { data } = await supabase
        .from("cafe_votes")
        .select("cafe_id, vote")
        .eq("user_id", uid);
      const map = new Map<string, 1 | -1>();
      for (const r of (data ?? []) as { cafe_id: string; vote: 1 | -1 }[]) {
        map.set(r.cafe_id, r.vote);
      }
      setMyVotes(map);
    },
    [supabase],
  );

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (cancelled) return;
      setUser(u);
      if (u) void loadMyVotes(u.id);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) void loadMyVotes(u.id);
      else setMyVotes(new Map());
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase.auth, loadMyVotes]);

  const handleQuickVote = useCallback(
    async (cafeId: string, dir: 1 | -1) => {
      if (!user) return;
      if (myVotes.get(cafeId) === dir) {
        await supabase
          .from("cafe_votes")
          .delete()
          .eq("cafe_id", cafeId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("cafe_votes")
          .upsert(
            { cafe_id: cafeId, user_id: user.id, vote: dir },
            { onConflict: "cafe_id,user_id" },
          );
      }
      await loadMyVotes(user.id);
      await reloadScores();
    },
    [user, myVotes, supabase, loadMyVotes, reloadScores],
  );

  const hoods = useMemo(() => {
    const set = new Set<string>();
    for (const c of cafes) if (c.neighborhood) set.add(c.neighborhood);
    return Array.from(set).sort();
  }, [cafes]);

  const filtered = useMemo(() => {
    return cafes.filter((c) => {
      if (hood !== "all" && c.neighborhood !== hood) return false;
      if (onlyWifi && c.score.wifi_count === 0) return false;
      return true;
    });
  }, [cafes, hood, onlyWifi]);

  return (
    <div className="shell-section">
      <div className="shell-inner">
        <header className="cafes-x-header">
          <div>
            <p className="shell-eyebrow">CAFÉS · NÓMADES</p>
            <h1 className="shell-title">Cafés para <em>trabajar.</em></h1>
            <p className="shell-lead" style={{ marginTop: "0.6rem" }}>
              Recomendaciones de la comunidad: dónde hay buen WiFi, enchufes y lugar para abrir la laptop en Mar del Plata.
            </p>
          </div>
          <div className="cafes-x-filter">
            <select
              aria-label="Filtrar por barrio"
              className="cafes-x-select"
              value={hood}
              onChange={(e) => setHood(e.target.value)}
            >
              <option value="all">Todos los barrios</option>
              {hoods.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <label className="cafes-x-toggle">
              <input
                type="checkbox"
                checked={onlyWifi}
                onChange={(e) => setOnlyWifi(e.target.checked)}
              />
              Con WiFi confirmado
            </label>
            {user && (
              <a href="/cafes/nuevo" className="shell-btn-primary">+ Agregar café</a>
            )}
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="cafes-x-empty">
            Todavía no hay cafés cargados. ¡Sé el primero en recomendar uno!
          </p>
        ) : (
          <div className="cafes-x-grid">
            {filtered.map((c) => (
              <CafeCard
                key={c.id}
                cafe={c}
                myVote={myVotes.get(c.id) ?? null}
                canVote={!!user}
                onOpen={() => {
                  window.location.href = `/cafes/${c.id}`;
                }}
                onVote={(dir) => void handleQuickVote(c.id, dir)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verificar voto en el navegador**

Run: `npm run dev`, loguearse, abrir `/cafes`.
Esperado: los lobitos están habilitados; al votar 🐺▲ el contador `net_votes` sube y el lobito queda resaltado; volver a clickear el mismo lobito lo borra (net vuelve a 0); el toggle "Con WiFi confirmado" sigue funcionando.

- [ ] **Step 5: Lint + build**

Run: `npm run lint && npm run build`
Esperado: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/components/cafes/VoteWolf.tsx src/components/cafes/CafesClient.tsx src/app/globals.css
git commit -m "feat(cafes): voto lobito + chips + comentario (VoteWolf) y voto rápido en tarjeta"
```

---

### Task 5: Detalle compartible `/cafes/[id]`

**Files:**
- Create: `src/app/cafes/[id]/page.tsx`
- Create: `src/components/cafes/CafeDetail.tsx`

- [ ] **Step 1: Página RSC de detalle**

Crear `src/app/cafes/[id]/page.tsx`. Carga el café, su score y los comentarios de la comunidad (join a `profiles_public` para el nombre del autor):

```tsx
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CafeDetail from "@/components/cafes/CafeDetail";
import { createClient } from "@/lib/supabase/server";
import {
  EMPTY_SCORE,
  type Cafe,
  type CafeComment,
  type CafeScore,
} from "@/lib/types/cafes";

export const dynamic = "force-dynamic";

export default async function CafeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cafe } = await supabase
    .from("cafes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!cafe) notFound();

  const { data: scoreRow } = await supabase
    .from("cafe_scores")
    .select("*")
    .eq("cafe_id", id)
    .maybeSingle();

  // cafe_votes.user_id referencia auth.users (no profiles), así que NO se puede
  // embeber profiles_public por FK como hace la bolsa con author_id. Dos queries + merge.
  const { data: voteRows } = await supabase
    .from("cafe_votes")
    .select("user_id, vote, comment")
    .eq("cafe_id", id)
    .not("comment", "is", null);

  const withComment = ((voteRows ?? []) as { user_id: string; vote: number; comment: string | null }[])
    .filter((r) => typeof r.comment === "string" && r.comment.trim().length > 0);

  const authorIds = Array.from(new Set(withComment.map((r) => r.user_id)));
  const nameById = new Map<string, string | null>();
  if (authorIds.length > 0) {
    const { data: authors } = await supabase
      .from("profiles_public")
      .select("id, full_name")
      .in("id", authorIds);
    for (const a of (authors ?? []) as { id: string; full_name: string | null }[]) {
      nameById.set(a.id, a.full_name);
    }
  }

  const comments: CafeComment[] = withComment.map((r) => ({
    user_id: r.user_id,
    vote: r.vote === 1 ? 1 : (-1 as 1 | -1),
    comment: r.comment as string,
    author_name: nameById.get(r.user_id) ?? null,
  }));

  const score = scoreRow
    ? (() => {
        const { cafe_id, ...rest } = scoreRow as CafeScore;
        void cafe_id;
        return rest;
      })()
    : EMPTY_SCORE;

  return (
    <>
      <Navbar />
      <main className="cafes-x">
        <CafeDetail cafe={cafe as Cafe} score={score} comments={comments} />
      </main>
      <Footer />
    </>
  );
}
```

> Nota: `profiles_public` se consulta por `id` (= user id), igual que el resto del repo. La vista tiene `GRANT SELECT` a `anon, authenticated` (ver `scripts/010_profiles_lock_down.sql`), así que la lectura del nombre del autor funciona también para visitantes anónimos.

- [ ] **Step 2: Componente CafeDetail**

Crear `src/components/cafes/CafeDetail.tsx`. Muestra cabecera, score por chip, link a Maps, el panel `VoteWolf` y los comentarios. Carga la sesión en cliente:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  CAFE_AMENITIES,
  type Cafe,
  type CafeComment,
  type CafeScore,
} from "@/lib/types/cafes";
import VoteWolf from "./VoteWolf";

interface Props {
  cafe: Cafe;
  score: Omit<CafeScore, "cafe_id">;
  comments: CafeComment[];
}

export default function CafeDetail({ cafe, score, comments }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!cancelled) setUser(u);
    });
  }, [supabase.auth]);

  return (
    <div className="shell-section">
      <div className="shell-inner shell-inner--narrow">
        <a href="/cafes" className="shell-btn-ghost">← Volver a cafés</a>
        <header className="cafes-x-detail-head">
          <h1 className="shell-title">{cafe.name}</h1>
          {cafe.neighborhood && <p className="shell-lead">{cafe.neighborhood}</p>}
          {cafe.address && <p className="cafes-x-card-hood">{cafe.address}</p>}
          <p className="cafes-x-net">Lobitos netos: {score.net_votes} ({score.votes_count} votos)</p>
          <div className="cafes-x-chips">
            {CAFE_AMENITIES.map((a) => (
              <span key={a.key} className="cafes-x-chip">
                {a.emoji} {a.label} · {score[a.countKey]}
              </span>
            ))}
          </div>
          {cafe.maps_url && (
            <p style={{ marginTop: "0.8rem" }}>
              <a href={cafe.maps_url} target="_blank" rel="noopener noreferrer" className="shell-btn-ghost">
                Ver en Google Maps ↗
              </a>
            </p>
          )}
          {cafe.source === "community" && (
            <span className="cafes-x-badge">agregado por la comunidad</span>
          )}
        </header>

        <section className="cafes-x-section">
          <h2 className="shell-eyebrow">TU VOTO</h2>
          <VoteWolf cafeId={cafe.id} userId={user?.id ?? null} />
        </section>

        <section className="cafes-x-section">
          <h2 className="shell-eyebrow">COMENTARIOS</h2>
          {comments.length === 0 ? (
            <p className="cafes-x-empty">Todavía no hay comentarios.</p>
          ) : (
            <ul className="cafes-x-comments">
              {comments.map((c) => (
                <li key={c.user_id} className="cafes-x-commentitem">
                  <span className="cafes-x-commentvote">{c.vote === 1 ? "🐺▲" : "🐺▼"}</span>
                  <div>
                    <strong>{c.author_name ?? "Miembro"}</strong>
                    <p>{c.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Estilos del detalle**

Agregar al final de `src/app/globals.css`:

```css
.cafes-x-detail-head { margin: 1.2rem 0 2rem; }
.cafes-x-section { margin-top: 2rem; }
.cafes-x-comments { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1rem; }
.cafes-x-commentitem { display: flex; gap: 0.8rem; align-items: flex-start; border-left: 2px solid rgba(255,255,255,0.15); padding-left: 0.8rem; }
.cafes-x-commentvote { font-size: 0.9rem; }
```

- [ ] **Step 4: Verificar detalle + embed de autor**

Run: `npm run dev`, abrir `/cafes`, clickear una tarjeta → navega a `/cafes/<id>`.
Esperado: se ve la cabecera con score por chip, el link a Maps (si tiene), el panel de voto (CTA login si anónimo / lobito+chips+comentario si logueado), y la lista de comentarios. Dejar un comentario logueado, recargar: aparece con el nombre del autor.
Dejar un comentario logueado y recargar: aparece con el nombre del autor (tomado de `profiles_public`).

- [ ] **Step 5: Lint + build**

Run: `npm run lint && npm run build`
Esperado: sin errores.

- [ ] **Step 6: Commit**

```bash
git add "src/app/cafes/[id]/page.tsx" src/components/cafes/CafeDetail.tsx src/app/globals.css
git commit -m "feat(cafes): página de detalle /cafes/[id] con score, voto y comentarios"
```

---

### Task 6: Alta de café por la comunidad `/cafes/nuevo`

**Files:**
- Create: `src/app/cafes/nuevo/page.tsx`
- Create: `src/components/cafes/AddCafeForm.tsx`

- [ ] **Step 1: Página de alta**

Crear `src/app/cafes/nuevo/page.tsx`:

```tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddCafeForm from "@/components/cafes/AddCafeForm";

export const dynamic = "force-dynamic";

export default function NewCafePage() {
  return (
    <>
      <Navbar />
      <main className="cafes-x">
        <AddCafeForm />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Formulario de alta**

Crear `src/components/cafes/AddCafeForm.tsx`. Inserta en `cafes` con `source='community'` y `added_by` del usuario; redirige al detalle:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { CAFE_NAME_MAX } from "@/lib/types/cafes";

export default function AddCafeForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (cancelled) return;
      setUser(u);
      setAuthLoading(false);
    });
  }, [supabase.auth]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (name.trim().length === 0) {
      setError("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("cafes")
      .insert({
        name: name.trim().slice(0, CAFE_NAME_MAX),
        neighborhood: neighborhood.trim() || null,
        address: address.trim() || null,
        maps_url: mapsUrl.trim() || null,
        source: "community",
        added_by: user.id,
      })
      .select("id")
      .single();
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push(`/cafes/${data.id}`);
  };

  if (authLoading) {
    return (
      <div className="shell-section"><div className="shell-inner shell-inner--narrow" /></div>
    );
  }

  if (!user) {
    return (
      <div className="shell-section">
        <div className="shell-inner shell-inner--narrow cafes-x-gate">
          <p className="shell-eyebrow">CAFÉS · ACCESO REQUERIDO</p>
          <p className="shell-lead">Necesitás iniciar sesión para agregar un café.</p>
          <div className="cafes-x-gate-actions">
            <a href="/auth/login" className="shell-btn-primary">Ingresar →</a>
            <a href="/auth/registro" className="shell-btn-ghost">Crear cuenta</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell-section">
      <div className="shell-inner shell-inner--narrow">
        <a href="/cafes" className="shell-btn-ghost">← Volver a cafés</a>
        <h1 className="shell-title" style={{ marginTop: "1rem" }}>Agregar un <em>café.</em></h1>
        <form className="cafes-x-form" onSubmit={submit}>
          <label className="cafes-x-field">
            <span>Nombre *</span>
            <input value={name} maxLength={CAFE_NAME_MAX} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="cafes-x-field">
            <span>Barrio</span>
            <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Centro, Playa Grande…" />
          </label>
          <label className="cafes-x-field">
            <span>Dirección</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <label className="cafes-x-field">
            <span>Link de Google Maps</span>
            <input value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} placeholder="https://maps.google.com/…" />
          </label>
          {error && <p className="cafes-x-errmsg">{error}</p>}
          <button type="submit" className="shell-btn-primary" disabled={saving}>
            {saving ? "Guardando…" : "Agregar café"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Estilos del formulario**

Agregar al final de `src/app/globals.css`:

```css
.cafes-x-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; max-width: 30rem; }
.cafes-x-field { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.9rem; }
.cafes-x-field input { background: rgba(255,255,255,0.05); color: inherit; border: 1px solid rgba(255,255,255,0.15); border-radius: 0.5rem; padding: 0.55rem 0.7rem; }
```

- [ ] **Step 4: Verificar alta**

Run: `npm run dev`, loguearse, ir a `/cafes`, clic en "+ Agregar café".
Esperado: el form aparece; al enviar con nombre vacío muestra el error; al enviar con datos válidos crea el café y redirige a `/cafes/<id>` con el badge "agregado por la comunidad". El café nuevo aparece en `/cafes`.

- [ ] **Step 5: Lint + build**

Run: `npm run lint && npm run build`
Esperado: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/app/cafes/nuevo/page.tsx src/components/cafes/AddCafeForm.tsx src/app/globals.css
git commit -m "feat(cafes): alta de café por la comunidad (/cafes/nuevo)"
```

---

### Task 7: Entrada en el Navbar

**Files:**
- Modify: `src/components/Navbar.tsx`

El navbar declara un único array `const links: NavLink[]` (alrededor de la línea 113) que alimenta tanto el menú desktop (`links.map`, ~línea 143) como el mobile (~línea 265). Por eso un solo edit cubre ambos. Los labels NO usan emoji ("Inicio", "Comunidad", "Aprendizaje", "Empleos").

- [ ] **Step 1: Agregar la entrada al array `links`**

En `src/components/Navbar.tsx`, en el array `links`, agregar la entrada `Cafés` justo después de la de Empleos:

```tsx
  const links: NavLink[] = [
    { href: "/", label: "Inicio", match: (p) => p === "/" },
    { href: "/proyectos", label: "Comunidad", match: (p) => p === "/proyectos" || p.startsWith("/red") },
    { href: "/primer-trabajo", label: "Aprendizaje" },
    { href: "/bolsa", label: "Empleos" },
    { href: "/cafes", label: "Cafés" },
  ];
```

> Si el array real difiere de lo anterior (puede haber otros items intermedios), solo agregar la línea `{ href: "/cafes", label: "Cafés" },` respetando el orden; no reescribir las demás. El highlight de activo ya lo cubre `pathname.startsWith(l.href + "/")` (línea ~124), que matchea `/cafes/[id]`.

- [ ] **Step 2: Verificar en el navegador**

Run: `npm run dev`, abrir `/`.
Esperado: aparece "Cafés" en el navbar (desktop y, en viewport chico, mobile), navega a `/cafes`, y queda resaltado al estar en `/cafes` o `/cafes/<id>`.

- [ ] **Step 3: Lint + build**

Run: `npm run lint && npm run build`
Esperado: sin errores.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat(cafes): entrada Cafés en el navbar"
```

---

### Task 8: Script de seed (Google Places API → Supabase)

**Files:**
- Create: `scripts/seed-cafes.mjs`
- Create: `scripts/seed-cafes.helpers.mjs`
- Create: `scripts/seed-cafes.test.mjs`
- Modify: `README.md`

- [ ] **Step 1: Helper puro — mapear un Place a fila de `cafes`**

Crear `scripts/seed-cafes.helpers.mjs` (lógica pura, testeable sin red):

```js
// Mapea un resultado de Google Places (Text Search + Details) a una fila de cafes.
export function placeToCafeRow(place) {
  if (!place || typeof place.place_id !== "string" || !place.name) {
    throw new Error("place inválido: faltan place_id o name");
  }
  const loc = place.geometry?.location ?? {};
  return {
    name: String(place.name).slice(0, 120),
    address: place.formatted_address ?? place.vicinity ?? null,
    neighborhood: extractNeighborhood(place) ?? null,
    lat: typeof loc.lat === "number" ? loc.lat : null,
    lng: typeof loc.lng === "number" ? loc.lng : null,
    google_place_id: place.place_id,
    google_rating: typeof place.rating === "number" ? place.rating : null,
    google_reviews_count:
      typeof place.user_ratings_total === "number" ? place.user_ratings_total : null,
    maps_url:
      place.url ?? `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    source: "seed",
  };
}

// Intenta derivar el barrio de los address_components (sublocality / neighborhood).
export function extractNeighborhood(place) {
  const comps = Array.isArray(place.address_components) ? place.address_components : [];
  const match = comps.find(
    (c) =>
      Array.isArray(c.types) &&
      (c.types.includes("neighborhood") || c.types.includes("sublocality")),
  );
  return match ? match.long_name : null;
}
```

- [ ] **Step 2: Test del helper (runner nativo de Node)**

Crear `scripts/seed-cafes.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { placeToCafeRow, extractNeighborhood } from "./seed-cafes.helpers.mjs";

test("placeToCafeRow mapea campos básicos", () => {
  const row = placeToCafeRow({
    place_id: "abc123",
    name: "Café Test",
    formatted_address: "Av. Colón 1234, Mar del Plata",
    rating: 4.5,
    user_ratings_total: 200,
    geometry: { location: { lat: -38.0, lng: -57.5 } },
  });
  assert.equal(row.google_place_id, "abc123");
  assert.equal(row.name, "Café Test");
  assert.equal(row.google_rating, 4.5);
  assert.equal(row.google_reviews_count, 200);
  assert.equal(row.lat, -38.0);
  assert.equal(row.source, "seed");
  assert.match(row.maps_url, /place_id:abc123|maps/);
});

test("placeToCafeRow tira si falta place_id", () => {
  assert.throws(() => placeToCafeRow({ name: "x" }));
});

test("extractNeighborhood lee sublocality", () => {
  const hood = extractNeighborhood({
    address_components: [
      { long_name: "Playa Grande", types: ["sublocality", "political"] },
    ],
  });
  assert.equal(hood, "Playa Grande");
});

test("extractNeighborhood devuelve null sin match", () => {
  assert.equal(extractNeighborhood({ address_components: [] }), null);
});
```

- [ ] **Step 3: Correr el test y verque pase**

Run: `node --test scripts/seed-cafes.test.mjs`
Esperado: 4 tests pasando (`# pass 4`).

- [ ] **Step 4: Script de seed principal**

Crear `scripts/seed-cafes.mjs`. Usa `@supabase/supabase-js` (ya está en `node_modules`), Google Places Text Search + Details, upsert idempotente por `google_place_id`. Soporta `--dry-run`:

```js
#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { placeToCafeRow } from "./seed-cafes.helpers.mjs";

const DRY_RUN = process.argv.includes("--dry-run");
const QUERY = "cafe en Mar del Plata";
const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv() {
  const missing = [];
  if (!PLACES_KEY) missing.push("GOOGLE_PLACES_API_KEY");
  if (!SB_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!DRY_RUN && !SB_SERVICE) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) {
    console.error("Faltan variables de entorno:", missing.join(", "));
    process.exit(1);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAllPlaces() {
  const results = [];
  let pageToken = null;
  do {
    const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
    url.searchParams.set("query", QUERY);
    url.searchParams.set("type", "cafe");
    url.searchParams.set("key", PLACES_KEY);
    if (pageToken) url.searchParams.set("pagetoken", pageToken);
    const res = await fetch(url);
    const json = await res.json();
    if (json.status !== "OK" && json.status !== "ZERO_RESULTS") {
      throw new Error(`Places API: ${json.status} ${json.error_message ?? ""}`);
    }
    results.push(...(json.results ?? []));
    pageToken = json.next_page_token ?? null;
    if (pageToken) await sleep(2000); // el token tarda en activarse
  } while (pageToken);
  return results;
}

async function main() {
  requireEnv();
  console.log(`[seed-cafes] query="${QUERY}" dry-run=${DRY_RUN}`);
  const places = await fetchAllPlaces();
  console.log(`[seed-cafes] ${places.length} lugares encontrados`);

  const rows = [];
  for (const p of places) {
    try {
      rows.push(placeToCafeRow(p));
    } catch (e) {
      console.warn(`[seed-cafes] salteado: ${e.message}`);
    }
  }
  console.log(`[seed-cafes] ${rows.length} filas válidas`);

  if (DRY_RUN) {
    console.log(JSON.stringify(rows.slice(0, 5), null, 2));
    console.log("[seed-cafes] dry-run: no se escribió nada.");
    return;
  }

  const supabase = createClient(SB_URL, SB_SERVICE, {
    auth: { persistSession: false },
  });
  let ok = 0;
  for (const row of rows) {
    const { error } = await supabase
      .from("cafes")
      .upsert(row, { onConflict: "google_place_id" });
    if (error) console.warn(`[seed-cafes] error en ${row.name}: ${error.message}`);
    else ok += 1;
  }
  console.log(`[seed-cafes] upserted ${ok}/${rows.length}`);
}

main().catch((e) => {
  console.error("[seed-cafes] fallo:", e.message);
  process.exit(1);
});
```

- [ ] **Step 5: Dry-run real contra la API**

Run (con una API key válida exportada):
```bash
GOOGLE_PLACES_API_KEY=xxx NEXT_PUBLIC_SUPABASE_URL=https://yyy.supabase.co node scripts/seed-cafes.mjs --dry-run
```
Esperado: imprime el conteo de lugares y hasta 5 filas de ejemplo en JSON, sin escribir en Supabase. (Si no hay API key a mano, este step queda pendiente para el operador; el test del Step 3 ya cubre el mapeo.)

- [ ] **Step 6: Documentar en README**

Agregar a `README.md` una sección:

```markdown
## Seed de cafés (sección /cafes)

El listado base de cafés se siembra una sola vez desde Google Places API. **No corre en
producción** — lo ejecuta el operador localmente.

1. Aplicar la migración `scripts/012_cafes.sql` en el SQL Editor de Supabase.
2. Exportar variables:
   - `GOOGLE_PLACES_API_KEY` — key con Places API habilitada.
   - `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto.
   - `SUPABASE_SERVICE_ROLE_KEY` — service-role key (NUNCA se commitea ni va al cliente).
3. Probar sin escribir: `node scripts/seed-cafes.mjs --dry-run`
4. Sembrar: `node scripts/seed-cafes.mjs`

El upsert es idempotente por `google_place_id`, así que se puede re-correr para refrescar
ratings. Tests del mapeo: `node --test scripts/seed-cafes.test.mjs`.
```

- [ ] **Step 7: Commit**

```bash
git add scripts/seed-cafes.mjs scripts/seed-cafes.helpers.mjs scripts/seed-cafes.test.mjs README.md
git commit -m "feat(cafes): script de seed Google Places + helper testeado + doc"
```

---

### Task 9: Actualizar ARCHITECTURE.md

**Files:**
- Modify: `ARCHITECTURE.md`

- [ ] **Step 1: Agregar rutas a la tabla de rutas (sección 5)**

En la tabla de rutas de `ARCHITECTURE.md`, agregar las filas:

```markdown
| `/cafes` | Server (RSC) + cliente | Supabase: `cafes` + `cafe_scores` (lectura pública) |
| `/cafes/[id]` | Server (RSC) + cliente | Supabase: `cafes`, `cafe_scores`, `cafe_votes` (comentarios) |
| `/cafes/nuevo` | Client | Supabase: insert en `cafes` (logueado) |
```

- [ ] **Step 2: Documentar el schema (sección 7.2)**

Agregar bajo las tablas existentes:

```markdown
cafes
  id                  UUID PK
  name                TEXT NOT NULL
  address, neighborhood TEXT
  lat, lng            DOUBLE PRECISION
  google_place_id     TEXT UNIQUE              -- null si lo agregó la comunidad
  google_rating       NUMERIC
  google_reviews_count INT
  maps_url            TEXT
  source              TEXT CHECK ('seed' | 'community')
  added_by            UUID → profiles(id)      -- null para seed
  created_at, updated_at TIMESTAMPTZ

cafe_votes
  PRIMARY KEY (cafe_id, user_id)
  vote                SMALLINT CHECK (1 | -1)  -- lobito arriba/abajo
  has_wifi, has_power, good_seating, is_quiet BOOLEAN  -- chips de comodidades
  comment             TEXT
  created_at, updated_at TIMESTAMPTZ

cafe_scores (VIEW, security_invoker)
  agrega cafe_votes por cafe_id: net_votes, up/down/votes_count, *_count por comodidad
```

Y en la tabla de RLS (sección 7.3):

```markdown
| `cafes` | Pública | Insert logueado (community, propio); update/delete dueño o `is_admin()` |
| `cafe_votes` | Pública | Sólo el voto propio (`user_id = auth.uid()`) |
```

- [ ] **Step 3: Agregar nota del seed**

En la sección de scripts/seed (o al final de la sección Supabase), agregar:

```markdown
> El listado de `/cafes` se siembra con `scripts/seed-cafes.mjs` (Google Places API → upsert con
> service-role key). Corre offline, no en el deploy. Ver README.
```

- [ ] **Step 4: Verificar consistencia**

Releer las secciones editadas. Confirmar que los nombres de tablas/columnas coinciden con `scripts/012_cafes.sql` (Task 1) y con `src/lib/types/cafes.ts` (Task 2).

- [ ] **Step 5: Commit**

```bash
git add ARCHITECTURE.md
git commit -m "docs(cafes): documentar rutas /cafes, schema y RLS en ARCHITECTURE.md"
```

---

## Cierre

Al terminar las 9 tareas:
- `npm run lint && npm run build` en verde.
- `node --test scripts/seed-cafes.test.mjs` en verde.
- QA manual completo (anónimo y logueado) según los steps de verificación.
- La rama `feat/cafes-nomades` lista para PR (coordinar con el rebrand pendiente como acordado).
