# 06 · Auditoría, QA y plan de mejoras

> Auditoría de **responsive / mobile-friendly, performance, accesibilidad, QA funcional y SEO**
> de todo el sitio, con un plan de actividades priorizado. Junio 2026, tras mergear el Nomad & IT Hub
> (PRs #31–#38).

---

## 0. Metodología y limitaciones (leer primero)

Esta auditoría se hizo **a nivel de código + build**, no con navegador. En el entorno actual:

- ❌ **No hay credenciales de Supabase** (`NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` ausentes, sin
  `.env.local`). Por eso **no pude correr las migraciones SQL** ni testear funcionalmente las
  features dinámicas (auth, perfil, admin, bolsa, eventos con datos, red, newsletter, sugerencias
  de cafés).
- ❌ **No hay navegador/Lighthouse** en el entorno → performance y accesibilidad se auditan por
  código, configuración y tamaños de bundle del `next build`, no con métricas de runtime (LCP, CLS,
  TBT) ni con axe.

**Para completar la auditoría se necesita** una de estas dos cosas (ver §7):
1. Cargar los secrets de Supabase en el entorno de Cloud Agents (Dashboard → Secrets), o
2. Que alguien corra Lighthouse/PageSpeed + un pase manual en dispositivos, y las migraciones en el
   SQL Editor de Supabase.

> **Scripts pendientes:** la única migración sin aplicar es
> [`scripts/014_work_spot_submissions.sql`](../../scripts/014_work_spot_submissions.sql) (tabla de
> sugerencias de cafés). **No la pude ejecutar** por falta de credenciales. Hasta correrla, el
> catálogo de `/trabajar` funciona, pero el formulario de sugerencias devuelve error al enviar.

---

## 1. Estado del build (sano)

`next build` pasa: **76/76 páginas**, sin errores. `npm run lint` sin errores (sólo warnings
preexistentes de `<img>` y vars sin usar).

| Métrica | Valor | Lectura |
|---|---|---|
| First Load JS compartido | **~102 kB** | ✅ bien |
| Páginas del hub (nuevas) | ~186–188 kB | ✅ ok |
| Home `/` | 178 kB, **dinámica (ƒ)** | ⚠️ render por request (Supabase) |
| `/admin/scanner` | **281 kB** | ⚠️ zxing; es admin-only |
| Rutas del hub | estáticas (○) / SSG (●) | ✅ óptimo para SEO |

---

## 2. Responsive / mobile-friendly

### ✅ Lo que está bien
- Las páginas del hub usan `shell-grid--auto-*` (`repeat(auto-fit, minmax(...))`) → **reflow
  automático** a 1 columna en mobile. Sin anchos fijos problemáticos.
- `flex-wrap` en filtros, tags y CTAs.
- Next 15 inyecta el `<meta viewport>` por defecto.
- `AppSidebar` ya maneja mobile (`matchMedia("(max-width: 760px)")`).
- 28 bloques `prefers-reduced-motion` en `globals.css` → animaciones se desactivan correctamente.

### ⚠️ Hallazgos
| # | Severidad | Hallazgo |
|---|---|---|
| R1 | Media | **Navbar saturado**: en `lg:flex` hay 4 links + 3 dropdowns ("Vivir acá", "Ecosistema", "Recursos") + buscar + ingresar + sumate. Entre ~1024–1200px el pill puede quedar apretado o desbordar. Conviene subir el breakpoint del menú completo a `xl` o condensar. |
| R2 | Baja | Inputs de búsqueda con `minWidth: 200` dentro de flex-wrap: ok hasta 320px, pero conviene `width:100%` en `<480px`. |
| R3 | Media | **Verificación real pendiente**: sin navegador no puedo confirmar que no haya overflow horizontal en 320–375px en páginas densas (`/empresas`, `/trabajar`, `/admin`). Requiere Lighthouse mobile + prueba en dispositivo. |

---

## 3. Accesibilidad (a11y)

### ✅ Lo que está bien
- Forms del hub con `<label htmlFor>` (`SubmitWorkSpotForm`); búsquedas con `aria-label`.
- Dropdowns del navbar con `aria-haspopup`/`aria-expanded` + cierre con Escape/click-outside.
- Las 3 `<img>` crudas restantes (`Huevsites`, `ProfileClient`) tienen `alt`.
- Jerarquía de headings correcta en páginas nuevas (h1 → h2 → h3).

### ⚠️ Hallazgos
| # | Severidad | Hallazgo |
|---|---|---|
| A1 | **Alta** | **Acordeones FAQ sin afordancia**: los `<details><summary style="listStyle:none">` (en `/invertir`, `/vivir-en-mardelplata`, `/visa`, `/en/*`) ocultan el triángulo y **no tienen indicador visible** de que se expanden. Agregar un chevron (rotando con `[open]`). |
| A2 | Media | **Contraste de texto tenue**: `shell-card__meta` y `--shell-fg-dim` (`rgba(180,200,230,0.5–0.6)`) sobre fondo oscuro probablemente **no llegan a WCAG AA** para texto chico. Subir opacidad/realineación de color. |
| A3 | Media | **`<html lang>` global = `es`** también en `/en/*` (las EN marcan `lang="en"` sólo en `<main>`). Para a11y/SEO correcto, el `<html lang>` debería ser `en` en esas rutas. |
| A4 | Baja | Verificar **focus ring visible** en links/botones custom (`.shell-btn-*`, `.bolsa-x-pill`) — varios podrían depender del outline del browser. Definir `:focus-visible` consistente. |
| A5 | Baja | `<img>` crudas: además de `alt`, migrar a `next/image` mejora a11y/perf (sizes responsive). |

---

## 4. Performance

### ✅ Lo que está bien
- Bundle compartido chico (102 kB). Páginas del hub estáticas/SSG.
- `next.config.ts` con `formats: ['avif','webp']` y `deviceSizes` afinados.
- Animaciones CSS puras (sin Framer Motion).

### ⚠️ Hallazgos
| # | Severidad | Hallazgo |
|---|---|---|
| P1 | Media | **Home dinámica por request** (Supabase en RSC). Sin caché, cada visita pega a Supabase. Evaluar **ISR** (`export const revalidate = 300`) o cachear los queries → mejora TTFB/LCP y baja carga. |
| P2 | Media | **4 familias de fuente** (Inter, Space Grotesk, Fraunces con 3 ejes `SOFT/WONK/opsz`, JetBrains Mono). Fraunces variable con ejes es pesada. Revisar `subsets`, `display: swap` (lo hace next/font) y si se usan todas. |
| P3 | Baja | `/admin/scanner` 281 kB (zxing). Admin-only, pero se puede `dynamic()`-importar el lector para no cargarlo hasta iniciar cámara. |
| P4 | Baja | 3 `<img>` crudas sin sizing responsive (P5 = mismo fix que A5). |
| P5 | — | **Métricas reales (LCP/CLS/TBT) pendientes** de Lighthouse — no medibles acá. |

---

## 5. QA funcional

### ✅ Funciona sin backend (verificado por build estático)
`/`, `/invertir`, `/estudiar`, `/vivir-en-mardelplata` (+`/visa`), `/que-hacer`, `/empresas` (+`[slug]`),
`/trabajar` (+`[slug]`), `/en/invest`, `/en/live-in-mar-del-plata`, `/primer-trabajo/*`, `/brand`,
`/marketing-kit`, `/reglamento`, `/blog`, `/robots.txt`, `/sitemap.xml`. Filtros (empresas, cafés) y
calculadoras/localStorage (primer-trabajo) son client-side puros → ok.

### ⚠️ Requiere Supabase en vivo para QA (no testeable acá)
| Feature | Ruta | Nota |
|---|---|---|
| Datos de home | `/` | events/founders/members/jobs |
| Eventos | `/eventos` | lista desde Supabase |
| Comunidad / Red | `/proyectos`, `/red/*` | |
| Bolsa de trabajo | `/bolsa` | listar/publicar/votar |
| Auth | `/auth/*`, `/perfil` | signup/login/callback |
| Admin + scanner | `/admin`, `/admin/scanner` | gate `is_admin`, cámara |
| Miembro (QR) | `/miembro` | |
| Newsletter | `/api/newsletter` | tabla existe |
| **Sugerencias de cafés** | `/api/work-spots` | **requiere correr `014_*.sql`** |

> **Acción**: cargar secrets de Supabase para QA en vivo, o hacer un pase manual con credenciales
> reales. Sin eso, estas features no se pueden marcar como ✅.

---

## 6. SEO (auditoría)

### ✅ Fundaciones sólidas (ya implementadas)
`metadataBase`, `title.template`, canonical por ruta, OpenGraph/Twitter, JSON-LD
(`Organization`, `WebSite`, `Event`, `LocalBusiness`/`CafeOrCoffeeShop`, `EducationalOrganization`,
`FAQPage`, `ItemList`, `BreadcrumbList`), `sitemap.ts` (con entidades), `robots.ts`, hreflang ES/EN.

### ⚠️ Oportunidades
| # | Severidad | Hallazgo |
|---|---|---|
| S1 | **Alta** | **OG images genéricas**: todas usan `/mdpdev.png`. Generar **OG images por página** con `next/og` (`ImageResponse`) → mucho mejor CTR al compartir en redes/Slack/WhatsApp. |
| S2 | Media | **Sin medición**: falta conectar **Google Search Console** (enviar sitemap, ver queries/cobertura). Bloqueante para priorizar contenido por datos reales. |
| S3 | Media | Home dinámica: confirmar que Google la cachea bien; ISR (P1) ayuda. |
| S4 | Baja | Sumar `FAQPage` a `/estudiar` y `/que-hacer` (hoy sólo breadcrumb). |
| S5 | Baja | Más comparativas/pSEO con dato propio ("MdP vs Buenos Aires para devs remotos") una vez que GSC muestre demanda. |

---

## 7. Cómo habilitar la auditoría completa

1. **Supabase secrets** en Cursor (Dashboard → Cloud Agents → Secrets): `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Permite QA en vivo de features dinámicas y que un agente corra
   validaciones. *(Las migraciones SQL igual se aplican desde el SQL Editor de Supabase o con
   `service_role`.)*
2. **Correr la migración pendiente** `scripts/014_work_spot_submissions.sql` en Supabase.
3. **Onboarding para testing manual** ([cursor.com/onboard](https://cursor.com/onboard)) si querés
   que se hagan pruebas tipo navegador (responsive real, Lighthouse, flujos de auth).
4. **Lighthouse / PageSpeed Insights** sobre las URLs productivas para LCP/CLS/TBT reales.

---

## 8. Plan de actividades (priorizado)

> **Estado (actualizado):** ya implementados por código en el PR de fixes —
> ✅ **A1** (acordeón FAQ con chevron), ✅ **S1** (OG images dinámicas vía `next/og`),
> ✅ **P1/S3** (home ahora estática con ISR 5m vía cliente Supabase sin cookies),
> ✅ **A4** (`:focus-visible` consistente), ✅ **S4** (FAQ en `/estudiar` y `/que-hacer`),
> ✅ **R1 (parcial)** (navbar colapsa a burger en `xl` para evitar saturación en pantallas medias).
> Pendientes (requieren tu acción o decisión): infra Supabase/GSC, A2 contraste, A3 `lang`, P2 fuentes,
> P3 lazy zxing, A5 `<img>`, mapas.


Severidad × esfuerzo. Cada ítem = un PR chico.

### 🔴 P0 — arreglos de alto impacto / bajo riesgo
- **A1** — Afordancia de acordeones FAQ (chevron + estado `[open]`). *(a11y/UX)*
- **S1** — OG images dinámicas por página con `next/og`. *(SEO/distribución)*
- **Infra** — Aplicar `014_*.sql` + cargar secrets Supabase (acción del equipo).
- **S2** — Conectar Google Search Console + enviar `sitemap.xml`. *(medición; acción del equipo)*

### 🟠 P1 — mejoras de calidad
- **R1** — Rediseño responsive del navbar (breakpoint `xl` o mega-menú condensado).
- **A2/A4** — Pase de contraste (texto tenue) + `:focus-visible` consistente.
- **P1/S3** — ISR/caché de la home (`revalidate`).
- **A3** — `<html lang>` correcto por ruta para `/en/*`.

### 🟡 P2 — optimizaciones
- **P2** — Auditar/aligerar fuentes (¿Fraunces con 3 ejes hace falta?).
- **P3** — `dynamic()` import del lector zxing en `/admin/scanner`.
- **A5/P4** — Migrar `<img>` crudas a `next/image`.
- **S4/S5** — `FAQPage` en `/estudiar` y `/que-hacer`; comparativas pSEO según GSC.

### 🟢 P3 — features/diseño (ver §9)
- Mapas en `/trabajar` y `/empresas` (MapLibre, lazy).
- Chrome EN consistente / imágenes en heros del hub.

---

## 9. Sugerencias de diseño (abiertas a debate)

1. **OG images branded por página** (océano + título + dato). Alto impacto al compartir. *(= S1)*
2. **Heros con imagen** en las páginas del hub: hoy son texto sobre fondo oscuro. Una foto costera
   sutil (con overlay para contraste) le daría calidez y "sentido de lugar" sin romper la identidad.
3. **Navbar**: en pantallas medias, condensar a un mega-menú "Explorá MdP" en vez de 3 dropdowns
   sueltos; resuelve R1 y ordena la IA.
4. **Acordeones FAQ** con chevron + transición suave (resuelve A1 y se ve más pulido).
5. **Mapas** en `/trabajar` y `/empresas` (MapLibre lazy): el patrón de los referentes (Freework,
   Dealroom). Es la mejora visual de mayor "wow" pendiente — implica sumar 1 dependencia (decisión
   explícita, documentada).
6. **Tarjetas con micro-señales**: en `/trabajar`, íconos de WiFi/enchufes/ruido (estilo
   laptopfriendly) hacen las cards más escaneables.
7. **Modo claro por sección** para `/invertir` (más "corporativo" para compartir con inversores),
   usando las clases claras que ya existen.
8. **Consistencia EN**: hoy `/en/*` usa el `AppShell` con sidebar en español. Traducir las labels del
   sidebar o usar una chrome de marketing más liviana para landings.

---

## 11. Auditoría en vivo (con acceso a Supabase, jun 2026)

Ya con el MCP de Supabase + `.env.local`, se completó lo que antes estaba bloqueado.

### QA funcional (server de producción, datos reales) — ✅
Verificado con `next start` + requests reales:
- `/trabajar` lista los cafés desde Supabase (BIX Cowork, Bendito Pedro, FOLC, LINE UP…).
- `/trabajar/[slug]` renderiza la ficha + "Señales de la comunidad".
- `/empresas` muestra Globant, Roomix, AgroSistemas. `/` (200) y `/eventos` (200) renderizan con datos.

### Security advisors (Supabase linter)
| Hallazgo | Nivel | Estado |
|---|---|---|
| `work_spot_submissions` política INSERT permisiva | WARN | ✅ **Resuelto** — tabla dropeada (`scripts/016`, deprecada tras converger en `cafes`) |
| `cafes_public` view | — | ✅ OK — creada con `security_invoker`, no flaggeada |
| `profiles_public` es **SECURITY DEFINER** view | **ERROR** | ⚠️ Pre-existente del equipo — recomendado recrear con `security_invoker=true` ([linter 0010](https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view)) |
| Funciones con `search_path` mutable (touch_updated_at, is_admin, is_project_*, generate_qr_code, handle_new_user, …) | WARN | ⚠️ Pre-existente — `ALTER FUNCTION … SET search_path = ''` ([0011](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)) |
| `is_admin()`, `handle_new_user()`, `is_project_*` ejecutables por anon/authenticated (SECURITY DEFINER) | WARN | ⚠️ Pre-existente — revisar/`REVOKE EXECUTE` si no es intencional ([0028/0029](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)) |
| Bucket `avatars` permite listing | WARN | ⚠️ Pre-existente — endurecer policy de `storage.objects` ([0025](https://supabase.com/docs/guides/database/database-linter?lint=0025_public_bucket_allows_listing)) |
| Leaked Password Protection **deshabilitado** | WARN | ⚠️ Activar en Auth (HaveIBeenPwned) ([docs](https://supabase.com/docs/guides/auth/password-security)) |

> No toqué los hallazgos pre-existentes del equipo (cambiar `profiles_public` o `is_admin` sin
> entender todos sus consumidores puede romper la home/RLS). Quedan como tareas recomendadas.

### Mapa en `/trabajar` y `/empresas` — bloqueado por datos
La tabla `cafes` tiene `lat/lng` y `google_rating` **vacíos** (0/22); los `maps_url` son del tipo
`?query=nombre+dirección`, **sin coordenadas**. Para un mapa con marcadores hace falta **geocodificar**
(Google Geocoding/Places API → requiere una API key). Plan: con la key, escribo un script que rellena
`lat/lng` (+ rating) de los 22 cafés vía MCP, y recién ahí sumo el mapa (MapLibre, lazy).

---

## 10. Recomendación

Arrancar por **P0** (A1 + S1 son código de bajo riesgo y alto impacto; la infra de Supabase/GSC es
acción del equipo). Yo puedo ejecutar A1 y S1 ya. En paralelo, habilitar secrets + GSC desbloquea la
medición real para priorizar el resto con datos.
