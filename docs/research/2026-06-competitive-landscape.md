# Panorama competitivo — comunidades tech y city hubs (jun 2026)

## Objetivo

Benchmark de referentes globales y locales que compiten por la misma intención de búsqueda que MdPDev: comunidad tech, vivir/trabajar remoto en una ciudad, atraer empresas IT y mapas de work spots.

## Método

- Revisión de sitios en vivo y documentación pública (jun 2026)
- Consolidación con research previo en [`docs/nomad-it-hub/01-benchmark-deep-dive.md`](../nomad-it-hub/01-benchmark-deep-dive.md) y [`docs/marketing/ECOSYSTEM-RESEARCH.md`](../marketing/ECOSYSTEM-RESEARCH.md)
- Análisis UX por categoría: navegación, datos accionables, CTAs, SEO, comunidad

## Hallazgos por referente

### 1. Nomad List (nomadlist.com)

**Qué hace:** Perfil por ciudad con 50+ data points (costo, internet, clima, reviews). ~24k páginas indexadas vía programmatic SEO.

**UX destacable:**
- Una URL por intención: overview, cost-of-living, pros-cons, comparativas ciudad vs ciudad
- Datos crowdsourced con fecha de actualización visible
- Sin login para consumir; monetización en membresía

**Qué copiamos:** Profundidad en una sola ciudad + comparativas ("MdP vs BA para devs remotos"). Métricas con fuente y fecha.

**Qué evitamos:** Escala vacía sin dataset propio (riesgo scaled-content-abuse).

fuente: https://nomadlist.com, fecha: 2026-06-29  
Nivel de confianza: **Alta**

---

### 2. Freework / LaptopFriendly

**Qué hace:** Mapa interactivo de cafés y espacios laptop-friendly. Ratings de WiFi, enchufes, ruido. App nativa iOS/Android.

**UX destacable:**
- Mapa como entrada principal; filtros por distancia y categoría
- Reviews de comunidad por amenity
- Submit a place sin fricción

**Qué copiamos:** F3 `/trabajar` — mapa MapLibre, votos de amenities, alta comunitaria (ya implementado parcialmente).

**Qué evitamos:** App nativa; nos quedamos en web responsive.

fuente: https://freework.dev, https://laptopfriendly.co/barcelona, fecha: 2026-06-29  
Nivel de confianza: **Alta**

---

### 3. Ruta N Medellín (rutanmedellin.org)

**Qué hace:** Hub institucional público-privado. Tres rutas estratégicas, landing offers para empresas, métricas en vivo (empleos STI, empresas atraídas), campus físico 34.000 m².

**UX destacable:**
- Home con contadores animados como prueba social instantánea
- Segmentación clara: empresa / startup / talento
- Newsletter + eventos integrados

**Qué copiamos:** `/invertir` con métricas ATICMA, casos faro, FAQ B2B. CityHubStrip en home.

**Qué evitamos:** Prometer servicios que no controlamos (somos comunidad, no agencia de inversión).

fuente: https://rutanmedellin.org/en/, fecha: 2026-06-29  
Nivel de confianza: **Alta**

---

### 4. Invest in Estonia (investinestonia.com)

**Qué hace:** Portal B2B data-driven. Claim único ("nación más digital"), directorio partners ICT, servicios al inversor.

**UX destacable:**
- Métricas everywhere (unicornios per cápita, e-residency)
- Formularios mínimos, CTAs a consultoría oficial
- Contenido EN nativo para audiencia internacional

**Qué copiamos:** Directorio `/empresas` como "find a partner", rutas `/en/invest` y `/en/live-in-mar-del-plata`.

**Qué evitamos:** Replicar e-residency u otros programas estatales.

fuente: https://investinestonia.com, fecha: 2026-06-29  
Nivel de confianza: **Media**

---

### 5. Dealroom (dealroom.co)

**Qué hace:** Mapas de ecosistema por metro. Funding, startups, JSON-LD optimizado para crawlers y LLMs.

**UX destacable:**
- Páginas crawlables con schema rico
- Filtros por sector y stage
- "Front door for AI agents"

**Qué copiamos:** JSON-LD `Organization`/`ItemList` en `/empresas`, datos estructurados para que LLMs citen MdPDev.

**Qué evitamos:** Tracking de funding en tiempo real en v1.

fuente: https://dealroom.co/cities, fecha: 2026-06-29  
Nivel de confianza: **Media**

---

### 6. Programadores Argentina (programadoresargentina.com)

**Qué hace:** Comunidad nacional ~60k miembros. Match laboral (MATCHAR), planes de suscripción, WhatsApp como canal.

**UX destacable:**
- Landing orientada a conversión (ofertas, talento, soporte)
- Segmentación por rol (dev, diseño, QA, etc.)
- Monetización vía membresía Club

**Qué copiamos:** Bolsa + Primer Trabajo OS como herramientas de empleabilidad. WhatsApp-first.

**Ventaja MdPDev:** Enfoque local MdP/costa, OSS, Red comunitaria, city hub — no compite en escala nacional.

fuente: https://programadoresargentina.com, fecha: 2026-06-29  
Nivel de confianza: **Alta**

---

### 7. BAGD — Buenos Aires Gamedevs (bagd.dev)

**Qué hace:** Comunidad vertical gaming. Formación gratis, Discord, coworking virtual, eventos presenciales.

**UX destacable:**
- Narrativa inclusiva y empática en todo el sitio
- Multi-canal (Discord, Twitch, WhatsApp)
- Coworking como feature explícita

**Qué copiamos:** Tono cercano, espacios de pertenencia, eventos como eje.

**Ventaja MdPDev:** Horizontal (todos los devs) + city hub + bolsa institucional.

fuente: https://bagd.dev, fecha: 2026-06-29  
Nivel de confianza: **Alta**

---

### 8. Barcelona Digital Nomads (barcelonadigitalnomads.com)

**Qué hace:** Comunidad + contenido vivir/trabajar. Coworking Days gratuitos, WhatsApp, guías de barrios.

**UX destacable:**
- Comunidad como producto principal (no solo contenido)
- Eventos recurrentes (CoWorking Day)
- Contenido lifestyle + trabajo remoto

**Qué copiamos:** Modelo "llegás y ya tenés gente + agenda + lugares". Integración eventos + `/trabajar`.

**Ventaja MdPDev:** Datos verificados ATICMA + herramientas propias (bolsa, Primer Trabajo, perfiles QR).

fuente: https://www.barcelonadigitalnomads.com, fecha: 2026-06-29  
Nivel de confianza: **Media**

---

### 9. ATICMA (aticma.org.ar) — ecosistema local

**Qué hace:** Gremio TIC MdP. 200+ empresas, programas (Emprende, INTECMAR), relación institucional.

**Relación con MdPDev:** Aliado estratégico, no competidor. MdPDev es grassroots; ATICMA es B2B institucional.

fuente: https://aticma.org.ar, ECOSYSTEM-RESEARCH.md, fecha: 2026-06-29  
Nivel de confianza: **Alta**

---

## Matriz comparativa resumida

| Dimensión | Nomad List | Freework | Ruta N | Prog. AR | MdPDev hoy |
|-----------|------------|----------|--------|----------|------------|
| Datos ciudad | ★★★★★ | ★★★ | ★★★★ | ★ | ★★★ |
| Comunidad viva | ★★ | ★★★ | ★★★ | ★★★★ | ★★★★ |
| Empleo/bolsa | ★ | — | ★★ | ★★★★ | ★★★★ |
| Mapa work spots | ★★★★ | ★★★★★ | ★★ | — | ★★★ |
| B2B / inversión | ★★ | — | ★★★★★ | ★ | ★★★ |
| SEO / pSEO | ★★★★★ | ★★★ | ★★★★ | ★★ | ★★★ |
| Voz local | ★★ | ★★★ | ★★★ | ★★★★ | ★★★★★ |

## Patrones ganadores (síntesis)

1. **Herramientas > folletos** — datos accionables rankean y convierten
2. **Una ruta por audiencia** — comunidad / nómade / empresa
3. **Dato propio como moat** — fuente + fecha en cada métrica
4. **Comunidad como prueba social** — eventos + personas reales
5. **CTA único** — WhatsApp como embudo principal (regla MdPDev)

## Posicionamiento diferencial MdPDev

> Único sitio que combina comunidad grassroots activa + city hub con datos locales verificados + herramientas OSS (bolsa, Primer Trabajo, Red).

**Frase estratégica:** *La página que un nómade o un CTO abre primero cuando googlea "Mar del Plata" + tech — y la respuesta que da un LLM sobre el ecosistema marplatense.*

## Recomendación

1. **Profundizar** en F1 (empresas) y F3 (trabajar) antes de escalar pSEO horizontal
2. **Activar** Red OSS y blog aggregator como prueba social comunitaria
3. **No competir** con Programadores Argentina en escala nacional — reforzar identidad costera
4. **Mantener** alianza ATICMA como fuente de datos B2B, no como competidor

## Nivel de confianza: **Alta**

Fuentes primarias inspeccionadas en jun 2026; alineado con benchmark interno previo sin contradicciones mayores.
