# 05 · Orquestación: dividir el trabajo entre múltiples agentes

> Cómo paralelizar este proyecto entre varios agentes (Cloud Agents de Cursor u otros) sin
> pisarse. Define **roles (skills)**, **grafo de dependencias (DAG)**, **contratos entre
> workstreams** y **definición de done**. Cada skill está descripto en detalle en
> [`skills/`](skills/); las convenciones que cada agente respeta están en
> [`.cursor/rules/`](../../.cursor/rules/).

---

## 1. Los roles (skills)

Seis agentes especializados. Cada uno tiene un `SKILL.md` propio en `skills/`:

| Skill | Archivo | Responsabilidad | Toca |
|---|---|---|---|
| 🧭 **Orchestrator** | `skills/00-orchestrator.md` | Planifica, abre/distribuye tareas, revisa contratos, mergea en orden | el DAG, no código de feature |
| 🗄️ **Data/Backend** | `skills/01-data-backend.md` | Migraciones SQL, RLS, vistas `*_public`, queries Supabase, seeds | `scripts/`, `src/lib/supabase/`, fetchers |
| 🎨 **UI/Frontend** | `skills/02-ui-frontend.md` | Páginas, componentes, design system, navegación, home | `src/app/`, `src/components/` |
| 🔍 **SEO** | `skills/03-seo.md` | sitemap/robots/metadataBase, JSON-LD, i18n, comparativas | `src/lib/seo/`, `generateMetadata`, metadata routes |
| ✍️ **Content** | `skills/04-content.md` | Datasets curados (JSON), copy en voz de marca, fuentes/fechas, traducción EN | `src/content/nomad/`, copy |
| 🔌 **Integrations** | `skills/05-integrations.md` | Roomix (deep-link/partnership), calendario `.ics`, analytics/UTM | `src/lib/integrations/` |

Un mismo agente puede asumir varios skills si se trabaja en serie; el valor del split es
**paralelizar workstreams independientes** (ver DAG).

---

## 2. Grafo de dependencias (DAG)

```
                         ┌─────────────────────────┐
                         │  T0  SEO foundations     │   (SEO)
                         │  sitemap/robots/         │
                         │  metadataBase/JsonLd lib │
                         └──────────┬──────────────-┘
                                    │ (todo lo de abajo usa los helpers JSON-LD/metadata)
        ┌───────────────┬──────────┼───────────┬───────────────┬───────────────┐
        │               │          │           │               │               │
 ┌──────▼─────┐  ┌──────▼─────┐ ┌──▼────────┐ ┌▼───────────┐ ┌─▼──────────┐  ┌─▼──────────┐
 │ T1 Eventos+│  │ T2 Qué     │ │ T3 Estudiar│ │ T4 Trabajar│ │ T5 Vivir   │  │ T6 Empresas│
 │ (F2)       │  │ hacer (F5) │ │ (F6)       │ │ (F3)       │ │ (F4)       │  │ (F1)       │
 │ UI+SEO     │  │ Content+UI │ │ Content+UI │ │ Data+UI+SEO│ │ Content+UI │  │ Data+UI+SEO│
 └────────────┘  └────────────┘ └───────────-┘ └────────────┘ └─────┬──────┘  └─────┬──────┘
                                                                     │               │
                                                              ┌──────▼──────┐ ┌──────▼───────┐
                                                              │ T7 Roomix   │ │ T8 Invertir  │
                                                              │ (F7) Integr.│ │ (F8) UI+      │
                                                              │ dentro de T5│ │ Content+SEO  │
                                                              └─────────────┘ └──────────────┘

  Transversal (después de que existan rutas): T9 Rediseño IA/Home/Navbar (UI) ──► integra todo
  Continuo: SEO mantiene comparativas (F9 §3.3) e i18n a medida que las rutas existen.
```

### Reglas de dependencia
- **T0 primero.** Todo lo demás consume los helpers de SEO. Es chico y desbloquea a todos.
- **T1, T2, T3** son independientes entre sí y de todo → **arrancan en paralelo** apenas T0 está.
- **T4 (Trabajar)** y **T6 (Empresas)** requieren tabla nueva → **Data/Backend va primero** dentro
  de cada uno (migración + RLS + vista + fetcher) y **luego** UI/Frontend. Se paralelizan entre sí.
- **T5 (Vivir)** es Content-heavy; su bloque de alquiler depende de **T7 (Roomix)** pero puede
  entregar con placeholder.
- **T7** depende de T5 (vive dentro) + confirmación manual de URLs de Roomix.
- **T8 (Invertir)** depende de T6 (strip de ecosistema) — puede arrancar con logos estáticos.
- **T9 (Rediseño navbar/home/IA)** se hace **al final** o en paralelo tardío: necesita que las
  rutas destino existan para linkearlas. El `AudienceSwitchboard`/`CityHubStrip` pueden mockear
  links hasta que las rutas estén.

---

## 3. Contratos entre workstreams (para no pisarse)

El acoplamiento se da en **interfaces**, no en archivos. Definir el contrato **antes** de codear:

### 3.1 Data → UI (por cada tabla)
Data/Backend publica **primero** y comunica:
- Nombre de la vista pública (`companies_public`, `work_spots_public`).
- Tipo TS en `src/lib/types/` (ej. `src/lib/types/companies.ts`) — **fuente de verdad** del shape.
- Fetcher tipado (función server) que UI consume. UI **no** arma queries crudas nuevas.

UI consume ese tipo + fetcher. Mientras Data trabaja, UI maquetea contra un **mock tipado**
(patrón `src/lib/devMock.ts` ya existente).

### 3.2 Content → UI / Data
Content entrega JSON en `src/content/nomad/*.json` con un **schema acordado** (documentado en el
mismo archivo o un `.d.ts`). UI lo importa estático. Toda métrica trae `source` + `as_of`.

### 3.3 SEO → todos
SEO publica los helpers (`src/lib/seo/jsonLd.ts`, `<JsonLd>`) y un **checklist** (ver
`04-seo.md §8`). Cada workstream aplica el checklist en su propio PR; SEO revisa.

### 3.4 Convención de ramas/PRs
- Una rama por tarea: `cursor/<area>-<feature>-<suffix>` (ej. `cursor/data-companies-712f`).
- Una feature por PR; PRs chicos y revisables.
- Migraciones SQL **idempotentes** y numeradas en orden (coordinar el número con Orchestrator para
  evitar colisiones de `014/015/...`).
- Al mergear, actualizar `ARCHITECTURE.md` en el mismo PR (rutas, esquema, deps).

---

## 4. Secuenciación recomendada (olas)

**Ola 0 — desbloqueo (1 agente, serial):**
- T0 SEO foundations.

**Ola 1 — quick wins en paralelo (3–4 agentes):**
- T1 Eventos+ · T2 Qué hacer · T3 Estudiar · (Data empieza migraciones de T4/T6 en background).

**Ola 2 — features con datos (2–3 agentes):**
- T4 Trabajar (Data→UI→SEO) · T6 Empresas (Data→UI→SEO) · T5 Vivir (Content→UI) arranca.

**Ola 3 — integración y B2B (2 agentes):**
- T7 Roomix (dentro de T5) · T8 Invertir (usa T6).

**Ola 4 — pegamento (1 agente):**
- T9 Rediseño IA/Home/Navbar + i18n EN de las rutas de valor + comparativas SEO.

---

## 5. Definición de "Done" (por tarea)

Una tarea está done cuando:
1. `npm run lint` y `npm run build` pasan (warnings `<img>` preexistentes no bloquean).
2. La ruta renderiza con datos reales y con estado vacío manejado.
3. Cumple el **checklist SEO** (`04-seo.md §8`) y el **checklist de marca** (`03-redesign.md §6`).
4. Respeta las reglas de `.cursor/rules/`.
5. `ARCHITECTURE.md` actualizado.
6. PR abierto con descripción, screenshots si hay UI, y link a la tarea del DAG.

---

## 6. Tareas no-técnicas a trackear (no las hace un agente solo)

- **Partnership Roomix** (F7b): contacto humano con el equipo de Roomix (startup local de la
  comunidad) para embed/API oficial.
- **Relación ATICMA / Municipio / Distrito Tecnológico**: validar datos del polo, conseguir el
  alta de empresas, posibles co-marketing y links recíprocos (autoridad SEO).
- **Acceso a Google Search Console** del dominio (secret) para medición.
- **Curaduría inicial** de empresas/work spots/instituciones (data real con fuente).

Estas van en el backlog del Orchestrator como bloqueantes externos, no como código.

---

## 7. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Colisión de números de migración entre agentes | Orchestrator asigna el número antes de empezar |
| Datos inventados que erosionan credibilidad | Regla "fuente + fecha obligatoria"; Content/SEO revisan |
| Scope creep (mapa, i18n framework, theme switch) | Decisiones de dep en PR propio, documentadas; MVP sin mapa |
| UI bloqueada esperando Data | Mock tipado (`devMock`) + contrato de tipos primero |
| Roomix cambia esquema de URLs | Builder de URLs aislado en `lib/integrations/roomix.ts` |
| Romper identidad de marca | Checklist de marca + reglas Cursor + review |
