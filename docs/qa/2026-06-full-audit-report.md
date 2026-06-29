# Informe QA completo — MdPDev (jun 2026)

> Auditoría funcional, build, seguridad y performance. Complementa [`docs/nomad-it-hub/06-audit-qa-plan.md`](../nomad-it-hub/06-audit-qa-plan.md).

**Fecha:** 2026-06-29  
**Entorno:** Cloud Agent / workspace local  
**Build:** 76 rutas, exit 0

---

## 0. Limitaciones

| Limitación | Impacto |
|------------|---------|
| Sin `.env.local` (Supabase) | Suites S2–S6, S8 parcial no ejecutables en vivo |
| Sin navegador/Lighthouse en agent | Métricas LCP/CLS/TBT no medidas en runtime |
| Sin credenciales GSC/GA4 | Analytics no verificados |

**Acción requerida:** Configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` en Cloud Agents Secrets.

---

## 1. Automático — resultados

| Comando | Resultado | Notas |
|---------|-----------|-------|
| `npm run lint` | ✅ Pass | Warnings preexistentes (`<img>`, unused vars) |
| `npm run build` | ✅ Pass | 76/76 páginas |
| `npm run security:verify` | ⚠️ Skip | Faltan credenciales Supabase |

### Build highlights

| Métrica | Valor |
|---------|-------|
| First Load JS compartido | ~102 kB |
| Home `/` | ISR 5m (revalidate) |
| `/trabajar` | ISR 10m |
| `/admin/scanner` | ~165 kB first load (zxing lazy) |

---

## 2. Suites manuales S1–S8

### S1 — Landing `/` ✅ (código + build)

| Caso | Estado | Evidencia |
|------|--------|-----------|
| ISR revalidate 300 | ✅ | `page.tsx` export const revalidate |
| JSON-LD Organization + WebSite | ✅ | `layout.tsx` |
| AudienceSwitchboard 3 audiencias | ✅ | Componente montado |
| CityHubStrip métricas | ✅ | city-stats.json |
| CTA WhatsApp | ✅ | `TrackedOutboundLink` |
| CommandPalette Cmd+K | ✅ | Navbar |

**Pendiente runtime:** datos Supabase vacíos sin credenciales.

### S2 — Auth ⚠️ (no testeable sin Supabase)

| Caso | Estado |
|------|--------|
| Registro + cooldown 60s | Código presente |
| Callback upsert profile | Código presente |
| Middleware protege /admin, /perfil | Verificar middleware.ts |

### S3 — Perfil + QR ⚠️

| Caso | Estado |
|------|--------|
| Avatar presets | Código presente |
| huevsite embed | Código presente |
| /miembro?code= | Client Suspense |

### S4 — Eventos ⚠️

| Caso | Estado |
|------|--------|
| /eventos listado | AppShell + Supabase |
| Mystery events | Schema events |
| JSON-LD Event | eventos/page.tsx |

### S5 — Bolsa ⚠️

| Caso | Estado |
|------|--------|
| Filtros kind/tags | BolsaClient |
| PublishWizard multi-step | Presente |
| Votos + expiry 30d | RLS 003 |

### S6 — Admin ⚠️

| Caso | Estado |
|------|--------|
| Gate is_admin server | admin/layout.tsx |
| Scanner zxing lazy | Implementado |
| Dedupe QR 2.5s | scanner/page.tsx |

### S7 — Nomad Hub ✅ (estático verificado build)

| Ruta | Build | JSON-LD |
|------|-------|---------|
| /invertir | ○ Static | FAQPage |
| /estudiar | ○ Static | EducationalOrganization |
| /que-hacer | ○ Static | FAQPage |
| /vivir-en-mardelplata | ○ Static | FAQPage |
| /vivir-en-mardelplata/visa | ○ Static | FAQPage |
| /empresas + [slug] | ● SSG | Organization |
| /trabajar + [slug] | ○/● ISR | LocalBusiness |
| /en/invest | ○ Static | FAQPage |
| /en/live-in-mar-del-plata | ○ Static | FAQPage |

**Verificado:** StatCard/SourceTag con fuente en JSON. Faq accordion con chevron (A1 resuelto).

### S8 — Red + extras ⚠️

| Caso | Estado | Nota |
|------|--------|------|
| /red CRUD projects | ⚠️ | Requiere Supabase |
| /red/ideas filtros following/mine | ❌ | UI-only stub |
| /api/newsletter POST | ⚠️ | Insert only |
| /blog | ⚠️ | 2 items hardcoded |

---

## 3. Performance (código + build, sin Lighthouse)

| ID | Hallazgo | Severidad | Estado |
|----|----------|-----------|--------|
| P1 | Home ISR 5m | Media | ✅ Resuelto |
| P2 | 4 familias fuente (Fraunces variable) | Baja | Pendiente |
| P3 | Scanner zxing lazy | Baja | ✅ Resuelto |
| P4 | img crudas | Baja | Pendiente |
| P5 | LCP real producción | — | Pendiente manual |

### Lighthouse baseline (pendiente equipo)

Ejecutar PageSpeed Insights sobre:

- https://mardelplata.dev.ar/
- https://mardelplata.dev.ar/trabajar
- https://mardelplata.dev.ar/invertir
- https://mardelplata.dev.ar/empresas

Objetivo: LCP < 2.5s mobile.

---

## 4. Accesibilidad (código)

| ID | Hallazgo | Estado |
|----|----------|--------|
| A1 | FAQ chevron | ✅ Resuelto |
| A2 | Contraste shell-card__meta | ✅ Resuelto |
| A3 | html lang en /en/* | Pendiente |
| A4 | focus-visible | ✅ Resuelto |
| A5 | img → next/image | Pendiente |

---

## 5. SEO

| Check | Estado |
|-------|--------|
| metadataBase + template | ✅ |
| sitemap.ts dinámico | ✅ |
| robots.ts | ✅ |
| OG dinámico /api/og | ✅ |
| hreflang ES/EN (2 pares) | ✅ Parcial |
| GSC conectado | ❌ Pendiente |

---

## 6. Bugs encontrados (nuevos)

| ID | Riesgo | Descripción | Issue Linear sugerido |
|----|--------|-------------|---------------------|
| QA-1 | Medium | Filtros /red/ideas following/mine no wired | `[bug] Wire filtros ideas` |
| QA-2 | Medium | Blog usa hardcoded items, RSS dormido | `[feature] Blog agregador RSS` |
| QA-3 | Low | orderedFounders unused en page.tsx | `[chore] Lint cleanup` |

---

## 7. Checklist de cierre QA

- [x] lint + build pass
- [x] S7 nomad hub estático verificado
- [x] S1 landing verificado por código
- [ ] S2–S6 con Supabase en vivo
- [ ] Lighthouse 4 URLs producción
- [ ] security:verify con service role
- [ ] security:regression en CI

---

## Recomendación

1. **P0:** Configurar secrets Supabase → re-ejecutar S2–S6
2. **P0:** Aplicar `scripts/019_cafes.sql` en Supabase + geocoding restante
3. **P1:** GSC + MAR-11 GA4 para priorización data-driven
4. **P1:** Fix QA-1 (Red ideas filters)

## Nivel de confianza

- Build/lint/S7: **Alta**
- Suites dinámicas: **Baja** (bloqueadas por credenciales)
- Lighthouse: **No medido**
