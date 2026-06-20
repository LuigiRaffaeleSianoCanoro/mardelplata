# 04 · Plan SEO: ser la respuesta #1 (en Google y en LLMs)

> Objetivo: que `mardelplata.dev.ar` sea el primer resultado para las búsquedas de nómades y
> empresas IT sobre Mar del Plata, **y** la fuente que citan los asistentes de IA.
> Basado en el research de programmatic SEO 2026 y Dealroom "front door for AI agents" (cap. 1).

---

## 0. Diagnóstico actual

- ✅ Metadata básica + OpenGraph en `layout.tsx`. `lang="es"`.
- ✅ Algunas rutas con `metadata` propia (`/eventos`, `/primer-trabajo`).
- ❌ **No hay** `sitemap.ts`, `robots.ts`, ni `metadataBase` → URLs OG relativas, sin sitemap.
- ❌ **No hay** datos estructurados (JSON-LD) en ninguna parte.
- ❌ **No hay** i18n (todo ES) → invisibles para búsquedas en inglés (nómades extranjeros, CTOs).
- ❌ Sin canonical explícito ni `hreflang`.

Hay mucho upside de bajo esfuerzo. **F9-base (sitemap/robots/metadataBase/JSON-LD) debería ser
el primer PR del proyecto** porque beneficia a todo lo que venga después.

---

## 1. Fundaciones (PR #1, sin features nuevas)

1. **`metadataBase`** en `layout.tsx`:
   ```ts
   export const metadata: Metadata = {
     metadataBase: new URL("https://mardelplata.dev.ar"),
     // ...resto
   };
   ```
2. **`src/app/robots.ts`** (App Router metadata route) → permite todo + apunta al sitemap.
3. **`src/app/sitemap.ts`** → rutas estáticas + dinámicas (empresas, work_spots, eventos vía
   query a Supabase, igual que la home).
4. **Helpers JSON-LD** en `src/lib/seo/jsonLd.ts`: funciones tipadas que devuelven el objeto y un
   `<JsonLd>` server component que lo inyecta como `<script type="application/ld+json">`.
5. **Canonical** por página vía `alternates.canonical` en cada `generateMetadata`.

> Regla Next 15: usar las *metadata routes* (`sitemap.ts`, `robots.ts`) y la Metadata API, no
> archivos en `public/`. Mantiene todo tipado y dinámico.

---

## 2. Datos estructurados (JSON-LD) por tipo de entidad

El moat para LLMs y rich results. Un helper por tipo:

| Entidad | Schema | Dónde |
|---|---|---|
| Organización MdPDev | `Organization` + `WebSite` (`SearchAction`) | `layout.tsx` (global) |
| Empresa (F1) | `Organization` / `LocalBusiness` | `/empresas/[slug]` |
| Listado de empresas | `ItemList` | `/empresas` |
| Café/coworking (F3) | `LocalBusiness` / `CafeOrCoffeeShop` | `/trabajar/[slug]` |
| Evento (F2) | `Event` (rich results de eventos) | `/eventos` + ficha |
| Guía nómade (F4) | `FAQPage` + `Article` | `/vivir-en-mardelplata/*` |
| Institución (F6) | `EducationalOrganization` | `/estudiar` |
| Breadcrumbs | `BreadcrumbList` | todas las rutas anidadas |
| Datos del polo (F8) | `Dataset` (opcional) + `FAQPage` | `/invertir` |

**Prioridad alta:** `Event` (rich results inmediatos), `Organization`/`LocalBusiness` (lo que un
LLM lee para "empresas/cafés en MdP"), `FAQPage` (responde preguntas directas → featured snippets).

---

## 3. Programmatic SEO (acotado y con dato propio)

Lección dura del research: **pSEO sin dataset propio = scaled content abuse = desindexación.**
No generamos páginas vacías. Generamos páginas donde *tenemos* el dato:

### 3.1 Páginas-entidad (1 por registro real)
- `/empresas/[slug]` — una por empresa real (dato: la ficha).
- `/trabajar/[slug]` — una por work spot real (dato: wifi/enchufes/ruido/precio).
- `/eventos` fichas — una por evento real.

Estas escalan con los datos, no con plantillas vacías. ✅ seguras.

### 3.2 Páginas-intención sobre el dataset de la ciudad (patrón Nomad List)
Un dataset (MdP) → varias intenciones:
- `/vivir-en-mardelplata` (overview)
- `/vivir-en-mardelplata/costo-de-vida` (calculadora + desglose)
- `/vivir-en-mardelplata/internet`
- `/vivir-en-mardelplata/barrios`

### 3.3 Comparativas (alto valor, demanda de decisión)
- `/comparar/mardelplata-vs-buenos-aires`
- `/comparar/mardelplata-vs-lisboa`
- `/comparar/mardelplata-vs-medellin`

Sólo las que podamos llenar con **datos reales** de ambos lados (costo, internet, clima, husos).
Empezar con 3–5, no con 50. Cada comparativa = bloque de datos + tabla + veredicto honesto.

**Regla anti-spam (del research):** boilerplate < 40% por página; cada página con su bloque de
datos/tabla/gráfico único; interlinking dentro del hub.

---

## 4. Keywords objetivo (mapa de intención → ruta)

| Intención | Query ejemplo | Ruta destino |
|---|---|---|
| Vivir/remoto | "vivir en mar del plata trabajando remoto", "mar del plata digital nomad" | `/vivir-en-mardelplata` |
| Costo | "costo de vida mar del plata 2026", "cost of living mar del plata" | `/vivir-en-mardelplata/costo-de-vida` |
| Trabajar | "cafe para trabajar mar del plata", "coworking mar del plata", "wifi" | `/trabajar` |
| Visa | "visa nomade digital argentina" | `/vivir-en-mardelplata/visa` |
| Empresas | "empresas de software mar del plata", "empresas de IA mar del plata" | `/empresas` |
| Talento/Inversión | "polo tecnologico mar del plata", "invest in mar del plata tech" | `/invertir`, `/en/invest` |
| Estudiar | "carreras de programacion mar del plata", "universidades tech mar del plata" | `/estudiar` |
| Turismo+work | "que hacer en mar del plata" (ángulo nómade) | `/que-hacer` |

Investigar volumen real con datos antes de priorizar; arriba es la hipótesis de intención.

---

## 5. Internacionalización (ES/EN)

Los nómades extranjeros y los CTOs internacionales **buscan en inglés**. Sin EN somos invisibles
para ellos. Pero i18n total es caro; arrancamos acotado.

**Estrategia mínima viable:**
- Subpath `/en/...` para las rutas de mayor valor internacional: `/en/invest`,
  `/en/live-in-mar-del-plata`, `/en/work` (cafés), `/en/companies`.
- `hreflang` recíproco entre ES y EN (`alternates.languages` en `generateMetadata`).
- Las rutas de **comunidad** (eventos, bolsa, primer-trabajo) quedan **solo en ES** (audiencia local).
- Implementación: empezar con rutas EN duplicadas/curadas (no un framework i18n pesado). Si crece,
  evaluar `next-intl`. Decisión de dep se documenta aparte.

> La voz en EN es traducción cuidada de la voz de marca, no inglés corporativo genérico.

---

## 6. Optimización para asistentes de IA (GEO / "front door for agents")

Dealroom expone páginas crawlables con JSON-LD pensadas para que los LLMs las citen. Replicamos:
- **HTML estático/SSR** con contenido en el markup (no datos sólo client-side que el crawler no ve).
- **JSON-LD completo** (sección 2) → estructura legible por máquina.
- **`FAQPage`** con preguntas reales ("¿cuánto cuesta vivir en MdP?", "¿qué empresas de IA hay?")
  → es lo que los LLMs extraen y citan.
- `llms.txt` (opcional, emergente 2026) en la raíz apuntando a los hubs clave.
- Respuestas auto-contenidas y datadas: un LLM puede citar "según mardelplata.dev.ar (jun 2026)…".

---

## 7. Medición

- Google Search Console (sitemap, cobertura, queries) — requiere acceso/secret del dominio.
- Eventos de tráfico saliente (UTM) hacia Roomix (F7) y WhatsApp.
- KPI por audiencia: posiciones en las queries de §4; CTR de rich results de eventos; menciones
  en respuestas de LLMs (chequeo manual periódico).

---

## 8. Checklist SEO por PR de feature

Cada feature nueva que agregue rutas debe cumplir:
- [ ] `generateMetadata` con title/description/canonical/OG propios.
- [ ] JSON-LD del tipo correcto (sección 2).
- [ ] Entradas agregadas a `sitemap.ts` (si son rutas dinámicas, generadas desde la fuente).
- [ ] Contenido en el HTML server-rendered (no sólo client).
- [ ] `hreflang` si tiene par EN.
- [ ] Sin contenido duplicado/boilerplate > 40%.
- [ ] Interlinking desde/hacia el hub correspondiente.
