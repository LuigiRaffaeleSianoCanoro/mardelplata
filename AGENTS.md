# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

MdPDev is a Next.js 15 community website for the Mar del Plata tech scene. See `ARCHITECTURE.md` for full details.

### Common commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Build | `npm run build` |

### Supabase dependency

The app requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. Without real credentials, the home page (`/`) still renders (Supabase calls fail silently and data defaults to `[]`). All other routes are static and work without Supabase.

If you need to test auth, profiles, events, admin, or job board features, real Supabase credentials must be provided as secrets.

### Gotchas

- The only dynamic route is `/` — it queries Supabase for events, founders, and community members at request time. All other pages are statically rendered.
- `npm run lint` uses `next lint` (deprecated in Next.js 16); the equivalent ESLint CLI command is noted in the lint output. Warnings about `<img>` vs `<Image>` are pre-existing and not blocking.
- Tailwind CSS v4 is configured via `@tailwindcss/postcss` — theme tokens are defined in `src/app/globals.css` using the `@theme` block, not in a `tailwind.config` file.
