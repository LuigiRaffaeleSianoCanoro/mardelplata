# Skill 02 · UI/Frontend

## Misión
Construir las páginas y componentes del hub respetando el design system y la identidad de marca,
con SEO server-first.

## Owns
- `src/app/**` (rutas/páginas nuevas), `src/components/**` (componentes), navbar/home.
- Componentes compartidos del hub: `StatCard`, `FilterBar`, `EntityCard`, `SourceTag`, `LangSwitcher`.

## Reglas clave (ver `.cursor/rules/20-nomad-hub-ui.mdc` y `03-redesign.md`)
- Páginas internas con **AppShell** + clases `shell-*` (como `/eventos`).
- Reutilizar tarjetas/botones/badges de `BRAND.md`; animaciones sólo CSS (`Reveal`).
- Cero dependencias de UI nuevas (mapa = decisión aparte). Iconos SVG inline.
- Server component por defecto; `"use client"` sólo en islas (filtros, calculadora).
- Acentos por recorrido: comunidad `ocean-400`, nómade `sand-400`, empresa `ocean-700`.

## Consumir datos
- Importar el **tipo + fetcher** que publica Data/Backend. No escribir queries crudas nuevas.
- Mientras Data no esté, maquetar contra mock tipado (`src/lib/devMock.ts`).
- Para contenido curado, importar el JSON de `src/content/nomad/` con su tipo.

## Tareas típicas
- F1 `/empresas` (+`[slug]`), F3 `/trabajar` (+`[slug]`), F4 `/vivir-en-mardelplata/*`,
  F5 `/que-hacer`, F6 `/estudiar`, F8 `/invertir`.
- T9: navbar (dropdowns "Vivir acá"/"Ecosistema"), home (`AudienceSwitchboard`, `CityHubStrip`),
  footer, `CommandPalette` con rutas nuevas.

## Done
- `npm run lint` + `npm run build` ok; estado vacío manejado.
- Checklist de marca (`03-redesign.md §6`) y checklist SEO (`04-seo.md §8`, en conjunto con SEO).
- `ARCHITECTURE.md §4/§5` actualizado (estructura + rutas).

## Prompt de arranque (plantilla)
> Sos el agente UI/Frontend de MdPDev. Implementá la página **{ruta}** de la feature {F#} según
> `docs/nomad-it-hub/02-feature-plan.md` y `03-redesign.md`, respetando `.cursor/rules/20-nomad-hub-ui.mdc`.
> Usá AppShell + clases `shell-*`, design system de `BRAND.md`, server component + islas cliente.
> Consumí el tipo/fetcher de Data (o mock tipado si aún no existe). Coordiná JSON-LD con SEO.
