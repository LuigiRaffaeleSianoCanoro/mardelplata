# Engineering Task Backlog (Delegated CTO Execution)

**Parent issue:** MAR-1 - Hire your first engineer and create a hiring plan  
**Delegation context:** CEO -> CTO (execution artifact)  
**Document owner:** CTO  
**Scope:** Translate `docs/nomad-it-hub` roadmap into concrete, delegable engineering tasks  
**Last updated:** 2026-06-22

---

## 1) Source roadmap inputs

This backlog is mapped directly from:

- `docs/nomad-it-hub/02-feature-plan.md` (F1-F9 feature specs)
- `docs/nomad-it-hub/03-redesign.md` (IA/navigation/home/design-system changes)
- `docs/nomad-it-hub/04-seo.md` (SEO foundations, structured data, i18n)
- `docs/nomad-it-hub/05-agent-orchestration.md` (dependency DAG, sequencing, done criteria)
- `docs/nomad-it-hub/06-audit-qa-plan.md` (quality/perf/SEO hardening priorities)

---

## 2) Prioritization model

| Priority | Definition | Rule |
|---|---|---|
| P0 | Platform/foundation work that unlocks multiple streams | Must ship first |
| P1 | Core user value features with low/medium coupling | Parallelize once P0 is stable |
| P2 | Growth/B2B expansion features dependent on P1 outputs | Ship after required data/routes exist |
| P3 | UX polish and optimization layers | Continuous after core slices are live |

Execution order follows the orchestration DAG (`05-agent-orchestration.md`):  
**T0 -> (T1/T2/T3/T4/T6/T5) -> (T7/T8) -> T9**

---

## 3) Delegation-ready engineering backlog

> Owner role = accountable role for delivery.  
> The founding engineer executes most CTO-owned tasks once hired, with CTO oversight.

| ID | Pri | Roadmap mapping | Task (concrete implementation scope) | Owner role | Dependencies | Definition of done |
|---|---|---|---|---|---|---|
| ENG-01 | P0 | F9, T0 | Implement SEO foundations: `metadataBase`, `robots.ts`, `sitemap.ts`, JSON-LD helper library, canonical metadata guidelines | CTO | None | Foundations merged, lint/build pass, at least one route using helpers, `ARCHITECTURE.md` updated |
| ENG-02 | P1 | F2, T1 | Upgrade `/eventos`: month/type filters, next-event highlight improvements, JSON-LD `Event`, calendar export (`.ics`) | CTO | ENG-01 | `/eventos` supports new filters, structured data validates, `.ics` links functional, regressions tested |
| ENG-03 | P1 | F5, T2 | Create curated activities dataset (`activities.json`) and implement `/que-hacer` page with reusable activity cards | CTO | ENG-01 | Page live with curated content, responsive layout, metadata + JSON-LD/Breadcrumb coverage |
| ENG-04 | P1 | F6, T3 | Create institutions dataset (`institutions.json`) and implement `/estudiar` page with searchable/filterable institution list | CTO | ENG-01 | Page live with clean data model, metadata, basic filtering, empty state handling |
| ENG-05 | P1 | F3 (data), T4 | Add `work_spots` schema + RLS + `work_spots_public` view + typed fetcher + admin seed flow | CTO | ENG-01 | Idempotent migration merged, RLS verified, fetcher consumed by UI without raw query duplication |
| ENG-06 | P1 | F3 (UI/SEO), T4 | Implement `/trabajar` and `/trabajar/[slug]` with filters/cards/details, JSON-LD `LocalBusiness`, and robust empty states | CTO | ENG-05 | Listing + detail routes production-ready, metadata and schema wired, accessibility checklist met |
| ENG-07 | P1 | F4, T5 | Implement nomad guide route set (`/vivir-en-mardelplata/*`) with cost calculator, source-tagged stats, and content JSON structure | CTO | ENG-01 | All planned subroutes render, calculator persists state, source/date shown for every metric |
| ENG-08 | P2 | F7, T7 | Integrate Roomix v1 deep-link builder (UTM tracked presets) into nomad housing sections | CTO | ENG-07 | Roomix links generated from one utility, tested with real URL patterns, tracking parameters consistent |
| ENG-09 | P2 | F1 (data), T6 | Add `companies` schema + RLS + `companies_public` view + typed fetcher + admin seed workflow | CTO | ENG-01 | Migration and RLS pass review, seeded data visible via public view, typed contract documented |
| ENG-10 | P2 | F1 (UI/SEO), T6 | Implement `/empresas` and `/empresas/[slug]` with filters, search, JSON-LD `Organization` and `ItemList` | CTO | ENG-09 | Directory and detail pages ship with SEO metadata, stable filtering, and empty-state CTA |
| ENG-11 | P2 | F8, T8 | Implement `/invertir` and `/en/invest` landing experience with live stats module and ecosystem strip integration | CTO | ENG-07, ENG-10 | B2B pages published in ES/EN, metrics include source/date, CTA path to institutional contact works |
| ENG-12 | P3 | F9 (i18n), 03-redesign, T9 | Implement i18n/hreflang expansion for high-value EN routes and metadata parity between ES/EN pages | CTO | ENG-11 | `hreflang` reciprocal links present, canonical rules correct, no broken EN navigation paths |
| ENG-13 | P3 | 03-redesign, T9 | Redesign IA/navigation/home sections (`AudienceSwitchboard`, `CityHubStrip`, navbar updates, command palette links) | UXDesigner | ENG-03, ENG-04, ENG-06, ENG-10, ENG-11 | Updated UX spec approved and implemented, responsive behavior validated, no brand checklist regressions |
| ENG-14 | P3 | 06-audit-qa | Hardening pass: responsive fixes, a11y contrast/focus, OG image strategy, home caching/perf improvements | CTO | ENG-02..ENG-13 | Critical audit items resolved, documented before/after checks, lint/build pass on final baseline |

---

## 4) Backlog dependencies summary (quick view)

| Stream | Starts when | Primary blockers |
|---|---|---|
| Events/Activities/Study quick wins (ENG-02/03/04) | After ENG-01 | SEO foundation not merged |
| Work spots (ENG-05/06) | ENG-01 complete | Data model migration not approved |
| Nomad guide + Roomix (ENG-07/08) | ENG-01 complete (ENG-08 needs ENG-07) | Content schema drift, Roomix URL assumptions |
| Companies + Invest (ENG-09/10/11) | ENG-01 complete (ENG-11 needs ENG-10) | Incomplete seeded data and stats source validation |
| IA redesign + hardening (ENG-13/14) | Core routes live | UX decisions pending, unresolved P0/P1 issues |

---

## 5) Definition of done (global for every engineering task)

A task is not complete unless all are true:

1. Implementation matches feature scope in the mapped roadmap spec.
2. `npm run lint` and `npm run build` pass (pre-existing non-blocking warnings documented).
3. Metadata + structured data + canonical handling are implemented for new routes.
4. Empty states and failure states are handled explicitly.
5. Accessibility baseline is met (focus, semantic structure, contrast review, keyboard access where applicable).
6. Data changes are idempotent and protected by appropriate RLS policies.
7. `ARCHITECTURE.md` updated in same PR when architecture/schemas/routes change.

---

## 6) Proposed child tasks to open

The following child issues are ready to open under MAR-1.

| Child issue title | Owner | Rationale | Acceptance criteria |
|---|---|---|---|
| [CTO] Ship SEO foundations (metadataBase, sitemap, robots, JSON-LD helpers) | CTO | Unlocks every downstream feature and improves current discoverability immediately | SEO foundation code merged; at least 3 key routes migrated to helper; sitemap/robots valid |
| [CTO] Deliver Events+ upgrade (`/eventos` filters, Event JSON-LD, `.ics`) | CTO | Fast, visible user value and technical confidence milestone for first engineering cycle | Filters working, `.ics` export available, Event schema present, no regression in existing events flow |
| [CTO] Implement work spots backend (`work_spots`, RLS, public view, typed fetcher) | CTO | Required backend contract before `/trabajar` UX can be shipped safely | Migration idempotent, RLS approved, fetcher typed and consumed by UI layer |
| [UXDesigner] Finalize IA and navigation spec for 3-audience architecture | UXDesigner | Prevents rework when integrating nomad + ecosystem paths into current community navigation | Approved desktop/mobile IA spec with interaction states and accessibility notes |
| [CTO] Build `/trabajar` and `/trabajar/[slug]` with filters and schema markup | CTO | High-intent nomad feature with strong SEO potential and reusable entity UI patterns | Listing/detail routes shipped, filters stable, LocalBusiness schema validated, empty states included |
| [CTO] Build nomad living guide (`/vivir-en-mardelplata/*`) and cost calculator | CTO | Core "why MdP" decision support experience and dependency for Roomix/invest paths | Subroutes live, calculator persists settings, every stat includes source+date |
| [CMO] Curate and validate source-backed datasets (city stats, institutions, activities) | CMO | Engineering cannot ship trusted pages without verified content and citation quality | Content files delivered in agreed schema; each metric has source URL and as-of date; CTO sign-off complete |
| [CTO] Build companies directory (`/empresas` + slug pages) with organization schema | CTO | Core B2B ecosystem proof point and dependency for invest landing | Data model + pages live, filters/search work, Organization/ItemList schema present |
| [CMO] Launch `/invertir` and `/en/invest` content package with UX handoff | CMO | Converts ecosystem data into clear B2B narrative for local and international decision makers | Final bilingual copy delivered, UX handoff accepted by CTO, routes published with measurable CTA path |

---

## 7) Assumptions and constraints

1. CTO remains direct execution owner until founding engineer start date.
2. UXDesigner and CMO are available for cross-functional reviews within sprint timelines.
3. Real Supabase credentials and production-like data access are available for final validation.
4. Roomix integration remains deep-link based unless formal API partnership emerges.
5. No major stack changes (Next.js + Supabase + existing design system conventions remain in place).

