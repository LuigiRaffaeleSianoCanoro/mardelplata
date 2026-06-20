# 03 · Rediseño: arquitectura de información, navegación y design system

> Cómo encajan las features nuevas sin romper la identidad actual. Respeta `BRAND.md`
> (paleta `ocean`, mascota león marino, voz cercana) y la regla "cero deps de UI".

---

## 1. El problema de arquitectura de información (IA)

Hoy la navegación está pensada para **la comunidad** (Inicio, Comunidad, Aprendizaje, Empleos +
Recursos). Las nuevas audiencias (nómade, empresa IT) **no tienen entrada**. Si las metemos todas
al navbar, lo saturamos.

**Principio:** el sitio pasa de "single audience" a **"3 audiencias, 1 home"**. La home debe
ramificar temprano hacia los 3 recorridos sin perder a la comunidad local (que es el corazón).

### IA propuesta (mapa del sitio)

```
/                         Home (ramifica a las 3 audiencias)
│
├─ Comunidad (existe)
│   ├─ /proyectos · /red · /eventos · /bolsa · /primer-trabajo · /blog
│   └─ /perfil · /miembro · /auth/*
│
├─ Vivir en MdP  ◀── NUEVO recorrido NÓMADE
│   ├─ /vivir-en-mardelplata           (overview/hub)
│   ├─ /vivir-en-mardelplata/costo-de-vida
│   ├─ /vivir-en-mardelplata/internet
│   ├─ /vivir-en-mardelplata/visa
│   ├─ /vivir-en-mardelplata/barrios
│   ├─ /trabajar        (cafés/coworkings)
│   ├─ /que-hacer       (actividades)
│   └─ /estudiar        (instituciones)
│
└─ Invertir / Ecosistema  ◀── NUEVO recorrido EMPRESA IT
    ├─ /invertir  ·  /en/invest
    └─ /empresas  ·  /empresas/[slug]
```

---

## 2. Navegación (cambios concretos en `Navbar.tsx`)

El navbar es un pill con `links[]` + dropdown "Recursos". Mantener ≤5 ítems primarios.

**Propuesta de top-level (con dropdowns por recorrido):**

| Ítem navbar | Tipo | Contenido |
|---|---|---|
| Inicio | link | `/` |
| Comunidad | link/dropdown | `/proyectos`, `/eventos`, `/bolsa`, `/primer-trabajo`, `/blog` |
| **Vivir acá** | **dropdown nuevo** | `/vivir-en-mardelplata`, `/trabajar`, `/que-hacer`, `/estudiar` |
| **Ecosistema** | **dropdown nuevo** | `/empresas`, `/invertir` |
| Empleos | link | `/bolsa` (o mover dentro de Comunidad) |

- Reusar el patrón de dropdown que ya existe para "Recursos" (`nav-x-resources-menu`,
  manejo de click-outside/Escape) — replicarlo, no reinventarlo.
- El CTA "Sumate" (WhatsApp) **se mantiene** como conversión de comunidad.
- Sumar a `CommandPalette` las nuevas rutas (la ⌘K ya existe) para descubribilidad.
- **Selector de idioma ES/EN** (mínimo en recorridos nómade/invertir) — ver `04-seo.md`.

**Mobile:** el menú mobile ya agrupa por secciones (`nav-x-mobile-section`). Agregar dos
secciones nuevas ("Vivir acá", "Ecosistema") con el mismo markup.

---

## 3. Rediseño de la Home

La home actual: `Hero → Pillars → Events → Community → Huevsites → Channels → Manifesto →
Opportunities → Footer`. Está muy centrada en comunidad. Sumamos **2 secciones-puente** que
abren los recorridos nuevos, sin desplazar el alma comunitaria.

**Orden propuesto:**

```
Hero  (+ sub-CTAs por audiencia: "Soy de la comunidad" / "Vengo a trabajar remoto" / "Tengo una empresa")
Pillars
► AudienceSwitchboard   ◀── NUEVO: 3 cards grandes → Comunidad / Vivir acá / Ecosistema
Events
Community
Huevsites
► CityHubStrip          ◀── NUEVO: teaser de datos del polo (200+ empresas, 10.000 talentos…) → /invertir y /empresas
Channels
Manifesto
Opportunities
Footer  (+ columnas nuevas: "Vivir en MdP", "Ecosistema")
```

- **`AudienceSwitchboard`**: 3 tarjetas (patrón "card clara" de `BRAND.md`) que mandan a cada
  recorrido. Es la pieza que resuelve la IA de 3 audiencias en el primer scroll.
- **`CityHubStrip`**: franja de métricas con fuente (estilo Ruta N), link a `/invertir`. Reusa
  el componente `LiveStats` de F8.
- **Hero**: hoy recibe `nextEvent/membersCount/jobsCount`. Sumar copy/sub-CTAs que segmenten
  audiencia sin recargar (los 3 chips llevan a las 3 anclas/recorridos).

---

## 4. Extensiones del design system

### 4.1 Lo que se reutiliza tal cual (no inventar)

- **AppShell** (`src/components/app/AppShell.tsx`) + clases `shell-section`, `shell-inner`,
  `shell-eyebrow`, `shell-title`, `shell-lead`, `shell-tag--{flavor}` → todas las páginas internas
  nuevas (F1, F3, F4, F5, F6, F8) usan este shell, igual que `/eventos`.
- **Tarjetas** clara/oscura/equipo de `BRAND.md §5`.
- **`Reveal`** para animaciones de entrada (ya usado en home/eventos).
- **Badges de sección**, botones (primario `ocean-400`, WhatsApp `ocean-600`, outline).
- Paleta `ocean` + `sand` (acento). Tipografía Inter/Space Grotesk/Fraunces.

### 4.2 Componentes nuevos genéricos (a crear en `src/components/ui/` o `nomad/`)

| Componente | Uso | Notas |
|---|---|---|
| `StatCard` | métrica + label + **fuente + fecha** | obligatorio el slot de fuente (credibilidad) |
| `FilterBar` | filtros chips/select reutilizable | F1 y F3 comparten patrón → un solo componente |
| `EntityCard` | card de empresa / work spot / institución | variantes por tipo; base común |
| `MapView` (fase 2) | mapa MapLibre | sólo si se aprueba la dep; lazy-load, no en bundle inicial |
| `LangSwitcher` | ES/EN | ver i18n |
| `SourceTag` | "Fuente: ATICMA · jun-2026" | microcomponente, se usa en StatCard y guías |

### 4.3 Tokens nuevos (en `globals.css` `@theme`, espejar en `BRAND.md`)

La paleta `ocean` alcanza. Para **diferenciar visualmente los 3 recorridos** sin romper marca,
usar acentos por audiencia derivados de tokens existentes (no colores nuevos crudos):

| Recorrido | Acento | Token base |
|---|---|---|
| Comunidad | ocean (actual) | `ocean-400` |
| Vivir acá (nómade) | arena cálida | `sand-400` (ya existe, hoy subutilizado) |
| Ecosistema (empresa) | ocean profundo | `ocean-700` |

Esto da identidad por sección **sin** sumar paleta. Si hace falta un token nuevo, definirlo en
`@theme` y documentarlo en `BRAND.md` **en el mismo PR** (regla de la arquitectura).

### 4.4 ¿Modo claro?

Hoy el `body` es `bg-[#06070d]` (dark). Las páginas de city-hub orientadas a SEO/B2B (F1, F8)
podrían beneficiarse de secciones claras (más "corporativas", mejor para imprimir/compartir).
**Decisión:** no introducir un theme-switch global (over-engineering); usar **secciones claras
puntuales** con las clases `ocean-tint`/tarjeta clara que ya existen, como ya hace el design
system. Mantener consistencia: dark como base, claro como sección.

---

## 5. Accesibilidad y performance

- Mantener `aria-*` como en `Navbar`/dropdowns actuales.
- Imágenes con `next/image` (recordar `images.unoptimized: true` está activo → cuidar tamaños).
- Mapa (si entra) **lazy** y fuera del bundle inicial; nunca bloquear LCP de páginas SEO.
- Contraste: respetar `BRAND.md` (texto blanco sólo sobre `ocean-700+`).
- Las páginas SEO deben ser **server components** (estáticas/ISR) siempre que se pueda → no meter
  todo en `"use client"`. Sólo islas interactivas (filtros, calculadora) son cliente.

---

## 6. Checklist de "no romper marca" (para reviewers)

- [ ] ¿Usa `ocean` como primaria y `sand` sólo como acento?
- [ ] ¿Reusa AppShell + clases `shell-*` en páginas internas?
- [ ] ¿Cero dependencias de UI nuevas (salvo mapa aprobado explícitamente)?
- [ ] ¿Voz en español, tuteo, local? (inglés sólo en rutas i18n)
- [ ] ¿El CTA de WhatsApp comunidad sigue intacto?
- [ ] ¿Animaciones sólo CSS (`Reveal`/keyframes), sin Framer Motion?
- [ ] ¿`BRAND.md`/`ARCHITECTURE.md` actualizados si se tocaron tokens/estructura?
