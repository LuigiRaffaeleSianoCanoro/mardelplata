# Opciones de rebranding — MdPDev (jun 2026)

## Objetivo

Presentar tres direcciones de rebranding con pros/contras para decisión de stakeholders. Basado en auditoría [`2026-06-brand-audit-capas.md`](2026-06-brand-audit-capas.md) y gap analysis.

## Contexto

- BRAND.md v2 (jun 2026) ya define nomenclatura y dualidad visual
- Home rediseñada (T9): AudienceSwitchboard + CityHubStrip
- Nomad Hub mergeado (PRs #31–#38)
- Marketing Q3 en curso (MAR-5..14)

**No se recomienda rediseño visual desde cero.** El rebranding es decisión de **unificación vs. reposicionamiento narrativo**.

---

## Opción A — Unificar ocean (Brand Core everywhere)

### Descripción

Editorial shell (Fraunces, `#06070d`, mark `</>`) **solo en hero de home**. Resto del sitio migra a Capa 1 ocean: AppShell, hub pages, auth, perfiles.

### Cambios concretos

- AppShell: fondo `ocean-900`, tipografía Space Grotesk
- Navbar global: wordmark **MdPDev** + mascota león marino en todas las rutas
- Eliminar Fraunces del bundle global (perf P2)
- `/proyectos` pasa a AppShell o mantiene ocean navbar

### Pros

- Consistencia institucional para press, sponsors, ATICMA
- Menor peso de fuentes (performance)
- Un solo sistema para diseñar y mantener
- Alineado con `/brand` y marketing-kit

### Contras

- Pierde diferenciación editorial de la home (T9)
- Hub pages pierden estética "city guide" premium
- Esfuerzo alto: ~40 archivos con clases `shell-*`
- Riesgo de sentirse "genérico tech landing"

### Cuándo elegir

Prioridad institucional/press/sponsors sobre experiencia inmersiva home.

**Esfuerzo estimado:** Alto (3–4 sprints UI)

---

## Opción B — Mantener dualidad refinada (RECOMENDADA)

### Descripción

Conservar dos capas con **reglas operativas estrictas** ya esbozadas en BRAND §7, más puente visual en transiciones.

### Reglas propuestas (codificar en BRAND + AGENTS)

| Contexto | Capa | Wordmark |
|----------|------|----------|
| Home + `/proyectos` público | Capa 2 shell | `mardelplata.dev` |
| Hub ciudad (vivir, invertir, empresas, trabajar) | Capa 2 AppShell | `mardelplata.dev` en sidebar |
| Auth, perfil, admin, brand, marketing | Capa 1 ocean | **MdPDev** + mascota |
| Bolsa, Primer Trabajo | Sistemas propios | MdPDev en metadata |
| Comunicaciones externas (IG, press, sponsors) | Capa 1 ocean | **MdPDev** |

### Cambios concretos (mínimos)

1. Auth pages: agregar mascota + tagline principal en hero
2. Marketing-kit: eliminar copy legacy "Mar del Plata Dev"
3. Documentar en `BRAND.md` tabla de rutas → capa (link a brand-audit)
4. OG images: siempre generar con paleta ocean aunque la página sea shell

### Pros

- Respeta inversión T9 + Nomad Hub
- Marketing externo coherente (Capa 1) sin tocar home
- Esfuerzo bajo-medio
- Diferenciación vs. competidores genéricos

### Contras

- Curva de aprendizaje para contributors (dos sistemas)
- Transiciones Home → Login pueden sentirse disjuntas (mitigar con puente)
- Fraunces sigue en bundle (perf)

### Cuándo elegir

Status quo con documentación clara; balance comunidad + city hub.

**Esfuerzo estimado:** Bajo (1 sprint documentación + micro-UX)

---

## Opción C — Reposicionamiento narrativo "City Hub Tech"

### Descripción

Nuevo eje narrativo: **MdPDev = el city hub tech de Mar del Plata**, no solo "comunidad de devs". Comunidad pasa a ser un pilar, no el protagonista del hero.

### Cambios concretos

- Tagline principal: "El Hub Tech de la Costa Atlántica" → hero (ya parcialmente)
- Hero: CityHubStrip sube arriba de Community
- Navbar: "Comunidad" pasa a dropdown secundario; "Vivir acá" e "Ecosistema" más prominentes
- Copy orientado a nómade + empresa en metadata default
- Nuevo segmento `/en/*` expandido

### Pros

- Alineado con visión Nomad Hub README
- Mejor SEO para queries "vivir/trabajar Mar del Plata tech"
- Diferenciación vs. Programadores Argentina (nacional/comunidad)
- Atrae audiencia internacional (CTOs, nómades)

### Contras

- Riesgo de alienar comunidad local grassroots (corazón de MdPDev)
- Requiere validación con fundadores y ATICMA
- Cambio de copy en ~30 rutas
- WhatsApp CTA debe seguir siendo comunidad (regla core)

### Cuándo elegir

Si datos muestran que tráfico nómade/empresa > comunidad local (requiere GA4/GSC — MAR-11).

**Esfuerzo estimado:** Medio (2 sprints copy + IA)

---

## Matriz de decisión

| Criterio | A Unificar | B Dualidad | C City Hub |
|----------|------------|------------|------------|
| Esfuerzo | Alto | Bajo | Medio |
| Riesgo comunidad | Medio | Bajo | Alto |
| SEO city hub | Medio | Medio | Alto |
| Press/sponsors | Alto | Medio | Medio |
| Perf (fuentes) | Alto | Bajo | Bajo |
| Alineación BRAND v2 | Parcial | Alta | Media |

## Recomendación

**Opción B — Mantener dualidad refinada**, con gate para evaluar Opción C en Q4 2026 cuando MAR-11 (GA4) entregue datos de audiencia por recorrido.

### Próximos pasos (post-aprobación)

1. Fundadores confirman opción (issue Linear `[content] Decisión rebranding`)
2. Actualizar BRAND.md con tabla rutas → capa
3. Micro-UX auth bridge (mascota + tagline)
4. Limpiar marketing-kit legacy copy
5. Opcional Q4: revisitar Opción C con datos GA4

## Nivel de confianza: **Alta** (opciones); **Media** (recomendación — pendiente input stakeholders)
