# Reconciliación MAR-5..14 vs roadmap 2026

> Evita duplicados entre issues históricos del workspace `mardelplatadev` y el backlog nuevo del plan maestro.

**Última actualización:** 2026-06-29

---

## Issues MAR existentes (marketing plan)

Fuente: [`docs/marketing/PLAN.md`](../marketing/PLAN.md)

| ID | Título | Estado doc | Proyecto Linear nuevo | Issue nuevo equivalente | Acción |
|----|--------|------------|----------------------|-------------------------|--------|
| MAR-5 | Deep dive ecosistema | Done | P1 Rebranding | `[research] Informe competitivo` | **Cerrado** — entregable: `docs/research/2026-06-competitive-landscape.md` + ECOSYSTEM-RESEARCH |
| MAR-6 | Skill voz de marca | In progress | P1 Rebranding | `[content] Skill voz de marca (MAR-6)` | **Mantener MAR-6** — no duplicar |
| MAR-7 | Brand Book v2 | In progress | P1 Rebranding | `[content] Finalizar BRAND.md v2 y /brand` | **Mantener MAR-7** — vincular a brand-audit |
| MAR-8 | Pipeline Buffer + GH Actions | In progress | P6 Marketing | `[chore] MAR-8 Pipeline Buffer + GitHub Actions` | **Mantener MAR-8** |
| MAR-9 | Plan maestro | Done | — | Plan maestro implementado | **Cerrado** |
| MAR-10 | Calendario Q3 | In progress | P6 Marketing | `[chore] MAR-10 Calendario Q3 contenido` | **Mantener MAR-10** |
| MAR-11 | GA4 | Backlog | P6 Marketing | `[chore] MAR-11 GA4 + eventos custom` | **Mantener MAR-11** |
| MAR-12 | Templates Canva | In progress | P6 Marketing | `[chore] MAR-12 Templates Canva` | **Mantener MAR-12** |
| MAR-13 | Eventos → posts | Backlog | P6 Marketing | `[feature] MAR-13 Eventos Supabase → posts auto` | **Mantener MAR-13** |
| MAR-14 | Reporte mensual | In progress | P6 Marketing | `[chore] MAR-14 Reporte mensual template operativo` | **Mantener MAR-14** |

## Issues nuevos sin equivalente MAR

Estos se crean como issues nuevos (no duplican MAR-*):

| Área | Issues nuevos | Proyecto |
|------|---------------|----------|
| Research | competitive landscape, gap analysis, brand audit | P1 |
| QA | Secrets Supabase, S1-S8, Lighthouse, GSC | P5 |
| Nomad Hub | 019_cafes.sql, geocoding, F1c, calculadora | P3 |
| Comunidad | middleware, newsletter Resend, blog RSS, .ics | P2 |
| Red OSS | filtros ideas, seed, spotlight | P4 |
| Epics | 6 contenedores padre | Todos |

## Regla anti-duplicado

Al crear en Linear:

1. Si el título contiene `MAR-N`, usar el ID existente — **no crear issue paralelo**
2. Issues de research/QA usan prefijo `[research]` / `[chore]` sin número MAR
3. Vincular issues nuevos a MAR-7/MAR-6 con `relatedTo` cuando aplique

## Entregables que cierran MAR implícitamente

| MAR | Entregable en repo |
|-----|-------------------|
| MAR-5 | `docs/research/2026-06-competitive-landscape.md`, `docs/marketing/ECOSYSTEM-RESEARCH.md` |
| MAR-9 | Plan maestro + este roadmap |
| MAR-7 (parcial) | `docs/research/2026-06-brand-audit-capas.md`, `docs/research/2026-06-rebrand-options.md` |

## MAR-1 (hiring / engineering)

Parent issue separado. Backlog ENG-01..14 en [`docs/company/roadmap/engineering-task-backlog.md`](../company/roadmap/engineering-task-backlog.md) se mapea a proyectos P2/P3/P5 — no duplicar con issues de feature si ya existe ENG-XX.

---

## Checklist reconciliación

- [x] Tabla MAR-5..14 vs issues nuevos
- [x] Regla anti-duplicado documentada
- [x] Entregables research vinculados a MAR-5/MAR-7
- [ ] Actualizar estados MAR en Linear mardelplatadev (requiere MCP conectado)
