# Auditoría de marca — Capa 1 (ocean) vs Capa 2 (editorial shell)

## Objetivo

Mapear dónde se aplica cada capa visual definida en [`BRAND.md` §7](../../BRAND.md) y detectar fricciones de consistencia en wordmarks, taglines y CTAs.

## Metodología

- Revisión de layouts, `globals.css`, componentes Navbar/Footer/AppShell
- Clasificación por ruta según sistema visual dominante
- Test de voz contra principios BRAND.md §4

## Definición de capas

| Capa | Tokens | Tipografía | Uso previsto |
|------|--------|------------|--------------|
| **Capa 1 — Brand Core (ocean)** | `ocean-*`, `sand-*`, `hero-bg` | Space Grotesk + Inter | Marketing externo, auth, admin, brand book |
| **Capa 2 — Editorial Shell** | `--shell-bg` (#06070d), `shell-*` | Fraunces + JetBrains Mono | Home, landing chrome, `/proyectos` público |

## Mapa por ruta (build jun 2026)

### Capa 2 — Editorial shell (landing chrome)

| Ruta / grupo | Layout | Wordmark nav | CTA principal |
|--------------|--------|--------------|---------------|
| `/` | Navbar pill + Footer | `mardelplata.dev` + mark `</>` | WhatsApp "Sumate" |
| `/proyectos` | Navbar + Footer (sin AppShell) | Igual landing | WhatsApp |
| Body global | `layout.tsx` → `bg-[#06070d]` | — | — |

Componentes shell: Hero, AudienceSwitchboard, CityHubStrip, Manifesto, Channels (clases `shell-*` indirectas vía body).

### Capa 2 — AppShell (hub editorial oscuro)

| Ruta | AppShell | Clases |
|------|----------|--------|
| `/invertir`, `/estudiar`, `/que-hacer` | Sí | `shell-*` |
| `/vivir-en-mardelplata`, `/visa` | Sí | `shell-*` |
| `/empresas`, `/empresas/[slug]` | Sí | `shell-*` |
| `/trabajar`, `/trabajar/[slug]` | Sí | `shell-*` |
| `/eventos` | Sí | `shell-*` |
| `/en/invest`, `/en/live-in-mar-del-plata` | Sí | `shell-*` |
| `/red/*` | Sí (auth gate parcial) | `shell-*` + sidebar |

### Capa 1 — Ocean core

| Ruta / grupo | Estilo | Wordmark |
|--------------|--------|----------|
| `/brand`, `/marketing-kit` | Ocean + Space Grotesk | **MdPDev** |
| `/reglamento` | Landing light sections | MdPDev en metadata |
| `/auth/*` | `hero-bg`, ocean gradient | MdPDev |
| `/admin/*` | Ocean admin chrome | MdPDev |
| `/perfil`, `/miembro` | Ocean cards + gradientes | MdPDev |
| `/bolsa` | `bolsa-root` (tema propio claro) | MdPDev metadata |
| `/primer-trabajo/*` | Tema claro independiente | "Mar del Plata Devs" en metadata |
| `/preview/motion` | `bg-ocean-900` | Preview |

### Híbridos / fricción detectada

| # | Fricción | Severidad | Rutas |
|---|----------|-----------|-------|
| F1 | Navbar landing dice `mardelplata.dev`; metadata global dice `MdPDev` | Media | `/` vs `<title>` |
| F2 | Usuario pasa de shell editorial (home) a ocean (login/perfil) sin transición explicada | Media | Home → /auth/login |
| F3 | `/proyectos` usa shell landing pero componentes Red son los de AppShell | Baja | /proyectos |
| F4 | Primer Trabajo usa tercer sistema visual (claro, sin ocean ni shell) | Baja | /primer-trabajo/* |
| F5 | Bolsa usa cuarto sistema (`bolsa-root`) | Baja | /bolsa |
| F6 | Mascota león marino (Capa 1) no aparece en navbar shell (`</>` mark) | Media | Home, hub |

## Inventario taglines (consistentes)

| Contexto | Copy oficial | ¿Presente en sitio? |
|----------|--------------|---------------------|
| Tagline principal | El Hub Tech de la Costa Atlántica | Sí (metadata, Hero) |
| Hero descriptivo | Donde el talento de Mar del Plata se encuentra | Parcial |
| Descriptivo largo | Conectamos desarrolladores… costa atlántica | Sí (metadata, Hero) |
| CTA comunidad | Unirse a la comunidad / Sumate | Sí (WhatsApp) |

## Redes sociales (consistencia)

| Canal | Handle documentado | En Footer/Navbar |
|-------|-------------------|------------------|
| Instagram | @mardelplata.dev.ar | Sí |
| X | @Mardeldev | Sí |
| LinkedIn | company/mardelplata-dev | Sí |
| WhatsApp | Grupo oficial (CTA único) | Sí |

**Resultado:** Handles alineados con BRAND.md §7. Sin handles legacy en código activo.

## Alineación ATICMA

| Mensaje MdPDev | Riesgo competencia | Estado |
|----------------|-------------------|--------|
| "200+ empresas, 10.000 talentos" | Datos ATICMA citados con fuente | OK |
| "/invertir" landing B2B | Vidriera, no agencia inversión | OK (CTA a WhatsApp/ATICMA) |
| "Comunidad independiente" | Diferenciación explícita | OK en ECOSYSTEM-RESEARCH |

## Test de voz (10 piezas)

| # | Pieza | ¿Cumple BRAND? | Nota |
|---|-------|----------------|------|
| 1 | Hero H1 | Sí | Español, local, accionable |
| 2 | AudienceSwitchboard cards | Sí | Tuteo, tres audiencias |
| 3 | /invertir eyebrow EN | Sí | "THE AI HUB BY THE SEA" — posicionamiento B2B |
| 4 | Bolsa empty state | Sí | Cercano, sin jerga |
| 5 | Primer Trabajo misión | Sí | Inclusivo, orientado acción |
| 6 | Reglamento | Sí | Claro, valores comunidad |
| 7 | Footer newsletter | Sí | "Recibí novedades" |
| 8 | Auth registro | Sí | Español, cooldown explicado |
| 9 | Red vocabulario | Sí | Comunitario, sin "owner" |
| 10 | Marketing-kit | Parcial | Algunos templates legacy "Mar del Plata Dev" |

## Checklist auditoría

- [x] Inventario wordmarks, taglines, CTAs por grupo de rutas
- [x] Mapa fricción shell vs ocean vs sistemas terceros (bolsa, primer-trabajo)
- [x] Consistencia redes
- [x] Alineación ATICMA
- [x] Test de voz 10 piezas

## Recomendación

La dualidad Capa 1 / Capa 2 es **intencional** (BRAND §7) pero genera fricción en transiciones Home → Auth → AppShell. Opción recomendada: **B — Mantener dualidad con reglas operativas** documentadas en código (ver [`2026-06-rebrand-options.md`](2026-06-rebrand-options.md)), más puente visual en auth (mascota + wordmark unificado).

## Nivel de confianza: **Alta**

Auditoría basada en código fuente, no en capturas de pantalla.
