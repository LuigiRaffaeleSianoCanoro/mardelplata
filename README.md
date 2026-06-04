# mardelplata.dev.ar

> El hub tech de la costa atlántica — la plataforma de la comunidad de devs de Mar del Plata.

[![Live](https://img.shields.io/badge/live-mardelplata.dev.ar-7c3aed)](https://mardelplata.dev.ar)
[![Stack](https://img.shields.io/badge/stack-Next.js%2015%20%2B%20Supabase-3b82f6)]()
[![License](https://img.shields.io/badge/license-MIT-22d3ee)]()

---

## ¿Qué es esto?

`mardelplata.dev` es la plataforma open-source de **MdPDev**, la comunidad de developers, diseñadores, founders y curiosos que orbita alrededor de Mar del Plata. Combina:

- **Landing pública** con eventos, manifiesto y miembros
- **Auth completa** (signup, login, email verification) con Supabase Auth
- **Perfiles de miembros** con avatar, bio, redes y QR personal
- **Bolsa de trabajo** (empleos + freelance con votos comunitarios)
- **Primer Trabajo OS** — sistema de diagnóstico de empleabilidad para juniors (CV, LinkedIn, simulador HR)
- **Admin dashboard** + scanner QR para registrar asistencia a eventos
- **Red** (`/red`) — directorio de proyectos open source de la comunidad (público)

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, Webpack dev) |
| UI | React 19 + TypeScript 5 (strict) |
| Estilos | Tailwind CSS v4 + tokens propios (`shell-*`) |
| Smooth scroll | Lenis (lazy-loaded, bandwidth-aware) |
| Backend | Supabase (Auth + Postgres + RLS) |
| Auth | Supabase Auth con email + magic link |
| QR | `qrcode.react` + `@zxing/library` |
| Fuentes | Fraunces (display serif) + Inter (body) + JetBrains Mono |
| Deploy | Vercel (`mardelplata.dev.ar`) |

Sin frameworks de UI (shadcn/MUI/Radix). Sin state management. Sin librerías de animación — todo CSS animations + Lenis.

---

## Cómo correrlo

### Requisitos

- Node 20+
- npm 10+
- Una cuenta de Supabase (free tier alcanza)

### Setup

```bash
# 1. Clonar
git clone https://github.com/LuigiRaffaeleSianoCanoro/mardelplata.git
cd mardelplata

# 2. Instalar
npm install

# 3. Variables de entorno
cp .env.example .env.local  # (si no existe, ver "Variables de entorno" abajo)
# Editá .env.local con tus claves de Supabase

# 4. Migraciones de DB (en Supabase SQL Editor)
# Ver scripts/001_create_profiles_and_events.sql y demás archivos en scripts/

# 5. Dev
npm run dev
# → http://localhost:3000
```

### Variables de entorno

Definir en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role>     # solo para scripts/seed
```

### Scripts disponibles

```bash
npm run dev      # Next dev server (port 3000)
npm run build    # Build de producción
npm run start    # Correr build de producción
npm run lint     # ESLint
```

---

## Estructura

```
mardelplata/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── page.tsx            # Home pública (intro + landing)
│   │   ├── eventos/            # Calendario público
│   │   ├── bolsa/              # Bolsa de trabajo (auth required)
│   │   ├── red/                # Directorio open source (público)
│   │   ├── primer-trabajo/     # Sistema de diagnóstico empleabilidad
│   │   ├── perfil/             # Perfil del miembro (auth required)
│   │   ├── miembro/            # Vista pública de miembro vía QR
│   │   ├── admin/              # Dashboard admin (is_admin only)
│   │   ├── auth/               # Login, registro, callback, verificar
│   │   ├── reglamento/         # Código de conducta
│   │   ├── brand/              # Brand book
│   │   └── marketing-kit/      # Recursos de prensa
│   ├── components/
│   │   ├── Hero, Pillars, Events, Community,
│   │   │   Channels, Manifesto, Opportunities,
│   │   │   Footer            # Secciones de la home
│   │   ├── Navbar              # Pill horizontal con auth-aware links
│   │   ├── IntroSplashWaves    # Intro con malla low-poly + glitch
│   │   ├── AssetsGate          # Pausa intro hasta que carguen assets
│   │   ├── Reveal              # IntersectionObserver fade+up
│   │   ├── ParallaxProvider    # Lenis + scroll-driven CSS vars
│   │   ├── ScrollDriver        # Side rail con chapter ticks
│   │   ├── app/                # AppShell + AppSidebar (logged-in)
│   │   ├── bolsa/              # ClassifiedCard, Modal, PublishWizard
│   │   └── red/                # ModuleSheet, IdeaCard, ProjectCard
│   ├── lib/
│   │   ├── supabase/           # Clients (server + browser)
│   │   ├── types/              # Types compartidos
│   │   └── devMock.ts          # Mock data para desarrollo offline
│   └── content/                # Contenido estático (primer-trabajo, etc.)
├── scripts/                    # Migraciones SQL + seeds
├── public/
│   ├── icons/                  # Icon pack glassmorph (12 PNGs)
│   ├── avatars/                # Presets de avatar SVG
│   └── *.png                   # Assets del hero/footer
├── ARCHITECTURE.md             # Doc viva de arquitectura
├── BRAND.md                    # Voice + visual identity
└── AGENTS.md                   # Instrucciones para agents AI
```

---

## Lenguaje visual

El sistema se apoya en tokens reusables (en `src/app/globals.css`, sección `FOUNDATION TOKENS`):

```css
/* Surfaces */
--shell-bg, --shell-bg-soft, --shell-bg-card

/* Accents */
--shell-violet, --shell-cyan, --shell-emerald, --shell-rose, --shell-amber, --shell-sky

/* Typography stacks */
--shell-font-display  /* Fraunces serif */
--shell-font-body     /* Inter */
--shell-font-mono     /* JetBrains Mono */
```

Y building blocks:

```css
.shell-section, .shell-inner, .shell-eyebrow, .shell-title,
.shell-card, .shell-btn-primary, .shell-btn-ghost,
.shell-link, .shell-tag, .shell-grid
```

Para agregar una página nueva, usá estas clases. Si necesitás algo específico, agregás un selector `.<nombre>-x` aparte.

Ver [`BRAND.md`](BRAND.md) para voz, valores visuales y guidelines de copy.
Ver [`ARCHITECTURE.md`](ARCHITECTURE.md) para el detalle técnico.

---

## Contribuir

La comunidad es open source. Si querés sumar algo:

1. Forkeá el repo
2. Creá un branch (`feat/lo-que-sea`)
3. Seguí las convenciones de `AGENTS.md` (commits descriptivos, sin secretos, no skipear hooks)
4. Abrí un PR contra `main`

Para ideas, revisá [`/red`](https://mardelplata.dev.ar/red) o el grupo de WhatsApp.

---

## Comunidad

- 🌐 **Web**: [mardelplata.dev.ar](https://mardelplata.dev.ar)
- 💬 **WhatsApp**: [chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs](https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs)
- 📷 **Instagram**: [@mardelplata.dev.ar](https://www.instagram.com/mardelplata.dev.ar/)
- 🐦 **X**: [@Mardeldev](https://x.com/Mardeldev)

---

## Licencia

MIT — Hecho con ♥ desde la costa atlántica.

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

> Nota: `neighborhood` queda en `null` en la semilla (Text Search no devuelve `address_components`); lo completa la comunidad. `maps_url` usa el link canónico por `place_id`.
