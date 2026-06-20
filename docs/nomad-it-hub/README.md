# Mar del Plata: Hub para Nómades Digitales y Empresas IT

> **Estado:** Propuesta / plan de trabajo. Ningún documento de esta carpeta cambia
> código de producción — son el blueprint para una serie de PRs que sí lo harán.
> Esta carpeta es la **fuente de verdad** del proyecto "Nomad & IT Hub" hasta que
> las features se mergeen y se documenten en `ARCHITECTURE.md`.

---

## 0. TL;DR

Queremos convertir `mardelplata.dev.ar` en **el lugar número uno de internet** para
responder dos preguntas:

1. *"¿Puedo vivir y trabajar remoto desde Mar del Plata?"* (nómade digital)
2. *"¿Me conviene abrir/expandir mi empresa de tech en Mar del Plata?"* (empresa IT)

Hoy el sitio es una **plataforma de comunidad** (eventos, perfiles, bolsa de trabajo,
Primer Trabajo OS). La propuesta agrega una **capa de "city hub"**: datos verificables,
herramientas interactivas y contenido optimizado para SEO que ningún competidor local
tiene centralizado.

La tesis (validada por el research del cap. 1): **los portales que ganan no son folletos
turísticos, son herramientas con datos propios.** Nomad List rankea con ~50 data points
por ciudad; Invest in Estonia y Ruta N (Medellín) ganan con rutas claras por audiencia y
métricas en vivo. Nuestra ventaja: **somos locales**, tenemos comunidad real, y MdP ya es
el **3er polo tech de Argentina** (200+ empresas, 10.000 talentos, 1er clúster de IA del país
según ATICMA). Nadie está contando esa historia con datos en un solo lugar.

---

## 1. El contexto de Mar del Plata (por qué ahora)

Datos públicos que sustentan la apuesta (fuentes en `01-benchmark-deep-dive.md`):

- **3er polo tecnológico de Argentina** (ATICMA, 2025–2026).
- **200+ empresas** de tecnología y **~10.000 talentos** (directos, indirectos y freelance).
- **USD 600M** de facturación anual del sector, **USD 125M** exportados.
- **1er clúster de IA del país**: 30+ empresas con servicios de IA.
- **Distrito Tecnológico** municipal en pleno desarrollo.
- **5 universidades** con carreras de economía del conocimiento.
- Casos faro: **Roomix** (proptech con IA, inversión de figuras de OpenAI/Meta/Vercel),
  startups marplatenses llegando a Silicon Valley.
- Ventaja de estilo de vida: ciudad costera, costo de vida bajo en USD, husos horarios
  alineados con EE.UU., visa de nómade digital de Argentina (residencia transitoria
  renovable hasta 360 días).

La materia prima existe. Falta el **escaparate digital** que la ordene y la posicione.

---

## 2. Visión de producto

Tres audiencias, tres recorridos, un mismo dataset:

| Audiencia | Pregunta | Recorrido propuesto |
|---|---|---|
| 🧑‍💻 Nómade digital | "¿Cómo es vivir y trabajar acá?" | `/vivir-en-mardelplata` → costo de vida, cafés/coworkings, visa, barrios, alquileres (Roomix) |
| 🏢 Empresa IT | "¿Por qué instalarme acá?" | `/invertir` → mapa del ecosistema, talento, universidades, incentivos, casos de éxito |
| 🌱 Comunidad local | "¿Qué pasa en la escena?" | lo que ya existe hoy (eventos, comunidad, bolsa) + integración con lo nuevo |

El "city hub" **no reemplaza** a la comunidad: la usa como prueba social. Cada herramienta
nueva manda tráfico de vuelta al embudo de WhatsApp y a los perfiles de miembros.

---

## 3. Mapa de features propuestas

Cada feature está detallada en `02-feature-plan.md`. Resumen:

| # | Feature | Ruta(s) propuestas | Datos | Complejidad |
|---|---|---|---|---|
| F1 | **Directorio de empresas tech** (mapa del ecosistema) | `/empresas`, `/empresas/[slug]` | Supabase `companies` | Alta |
| F2 | **Agenda de eventos tech** (ampliación de `/eventos`) | `/eventos` (existe) | Supabase `events` (existe) | Baja |
| F3 | **Cafés y coworkings work-friendly** | `/trabajar`, `/trabajar/[slug]` | Supabase `work_spots` | Media |
| F4 | **Guía para nómades** (costo de vida, visa, barrios) | `/vivir-en-mardelplata` | Contenido + dataset `city_stats` | Media |
| F5 | **Actividades turísticas / qué hacer** | `/que-hacer` | Contenido curado JSON | Baja |
| F6 | **Instituciones educativas** (carreras tech) | `/estudiar` | Supabase `institutions` o JSON | Baja |
| F7 | **Integración con Roomix** (alquileres) | embebido en F4 | Deep-links a roomix.ai | Baja-Media |
| F8 | **Landing "Invertir / Invest in MdP"** (B2B) | `/invertir` (ES) + `/en/invest` (EN) | Reusa F1+F4+F6 | Media |
| F9 | **Capa SEO** (sitemap, JSON-LD, i18n, pSEO) | transversal | — | Media |

---

## 4. Índice de documentos

| Documento | Contenido |
|---|---|
| [`01-benchmark-deep-dive.md`](01-benchmark-deep-dive.md) | Deep dive: cómo lo hacen Nomad List, Madeira, Tallinn/Estonia, Medellín/Ruta N, Lisboa, Dealroom, los buscadores de cafés. Qué copiar y qué evitar. |
| [`02-feature-plan.md`](02-feature-plan.md) | Spec de cada feature: rutas, modelo de datos Supabase, componentes, RLS, estados vacíos, fases de entrega. |
| [`03-redesign.md`](03-redesign.md) | Rediseños: arquitectura de información, navegación, nuevas secciones de la home, extensiones del design system (tokens, componentes), modo claro. |
| [`04-seo.md`](04-seo.md) | Estrategia SEO: programmatic SEO, JSON-LD por tipo de entidad, `sitemap.ts`/`robots.ts`/`metadataBase`, i18n ES/EN, keywords objetivo, plan de contenidos. |
| [`05-agent-orchestration.md`](05-agent-orchestration.md) | Cómo dividir el trabajo entre varios agentes: grafo de dependencias (DAG), secuenciación, contratos entre workstreams, definición de "done". |
| [`skills/`](skills/) | Specs de cada **agente especializado** (skill): Data/Backend, UI/Frontend, SEO, Contenido, Integraciones, Orquestador. |

Reglas de Cursor asociadas (para que cualquier agente respete convenciones):
[`.cursor/rules/`](../../.cursor/rules/).

---

## 5. Principios de ejecución (no negociables)

Heredados de `ARCHITECTURE.md` y `BRAND.md` — todo agente que tome una tarea los respeta:

1. **Cero dependencias de UI nuevas.** Nada de shadcn/MUI/Radix/Framer Motion. Tailwind v4
   a mano + animaciones CSS en `globals.css`. (Excepción a debatir explícitamente: librería
   de mapas para F1/F3 — ver `02-feature-plan.md §Mapas`.)
2. **Identidad oceánica.** Paleta `ocean`, mascota león marino, faro solo como decoración.
3. **Voz de marca.** Tuteo, cercano, local con orgullo, en español. El contenido en inglés
   (F8/SEO) es una **traducción cuidada**, no el default.
4. **Datos verificables o no van.** Un city hub vive de su credibilidad. Toda métrica lleva
   fuente y fecha. Sin datos inventados (ver `04-seo.md §Anti scaled-content-abuse`).
5. **Supabase + RLS** para todo lo dinámico; JSON estático para contenido curado de baja rotación.
6. **El embudo es uno.** El grupo de WhatsApp sigue siendo el CTA de conversión de comunidad;
   las nuevas features B2B suman un CTA de contacto institucional, sin fragmentar el de comunidad.
7. **Documento vivo.** Al mergear una feature, actualizar `ARCHITECTURE.md` en el mismo PR.

---

## 6. Cómo empezar (para un agente que llega nuevo)

1. Leé este README y el documento del workstream que te toca.
2. Leé `05-agent-orchestration.md` para entender de qué dependés y quién depende de vos.
3. Leé tu skill en `skills/` y las reglas en `.cursor/rules/`.
4. Trabajá en una rama `cursor/<workstream>-<desc>-<suffix>`, una feature por PR.
5. No empieces una tarea cuyas dependencias (columna "depende de" en el DAG) no estén mergeadas.
