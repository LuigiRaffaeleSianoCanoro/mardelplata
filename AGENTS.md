# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

MdPDev is a Next.js 15 community website for the Mar del Plata tech scene. See `ARCHITECTURE.md` for full details.

### Agent workflow (skills & rules)

El proyecto tiene una estructura de agentes en `.cursor/`:

| Capa | Ubicación | Propósito |
|------|-----------|-----------|
| **Rules** | `.cursor/rules/*.mdc` | Convenciones estáticas (core, data, UI, SEO, content) |
| **Skills** | `.cursor/skills/**/SKILL.md` | Workflows dinámicos (dev, Linear, QA, nomad-hub) |
| **Índice** | `.cursor/README.md` | Mapa completo y flujo de trabajo |

**Antes de implementar:** leer `ARCHITECTURE.md`, `BRAND.md` y el skill relevante en `.cursor/skills/`.

**Linear:** usar MCP Linear para issues (`linear-issue-writer`, `linear-workflow`).

**QA mínimo:** `npm run lint` + `npm run build`. Si hay SQL/RLS: `npm run security:verify`.

### Common commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Security verify | `npm run security:verify` |
| Security regression | `npm run security:regression` |

### Supabase dependency

The app requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. Without real credentials, the home page (`/`) still renders (Supabase calls fail silently and data defaults to `[]`). All other routes are static and work without Supabase.

If you need to test auth, profiles, events, admin, or job board features, real Supabase credentials must be provided as secrets.

### Gotchas

- The only dynamic route is `/` — it queries Supabase for events, founders, and community members at request time. All other pages are statically rendered.
- `npm run lint` uses `next lint` (deprecated in Next.js 16); the equivalent ESLint CLI command is noted in the lint output. Warnings about `<img>` vs `<Image>` are pre-existing and not blocking.
- Tailwind CSS v4 is configured via `@tailwindcss/postcss` — theme tokens are defined in `src/app/globals.css` using the `@theme` block, not in a `tailwind.config` file.
- Nomad Hub orchestration DAG: `docs/nomad-it-hub/05-agent-orchestration.md`
