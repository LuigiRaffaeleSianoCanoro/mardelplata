# Brand Book — MdPDev

> **MdPDev** — El Hub Tech de la Costa Atlántica.
> Comunidad de desarrolladores, diseñadores y emprendedores de Mar del Plata.

---

## 1. Logo y variantes

### Wordmark

El nombre de la marca es **MdPDev**, siempre escrito así: mayúsculas en `M`, `P` y `D`, sin espacios.

- Fuente: **Space Grotesk Bold**
- Color sobre fondo oscuro: `#FFFFFF`
- Color sobre fondo claro: `ocean-900` (`#020030`)

### Ícono mascota — León marino

El mascot es un **león marino** (lobo marino), representado como un SVG outline minimalista de 24×24 pt. Hace referencia directa a la fauna costera de Mar del Plata.

**Anatomía del SVG** (`viewBox="0 0 24 24"`, `fill="none"`):

```
Cabeza    — ellipse cx="8" cy="7.5" rx="4" ry="3.5"
Ojo       — circle  cx="7" cy="6.5" r="0.8"
Hocico    — path "M11.5 8.5 C13 8 14 8.5 13.5 9.5"
Bigotes   — paths desde (11.5, 8) y (11.5, 9) hacia la derecha
Cuello    — path "M6 11 C5.5 13 6 15 7 16"
Cuerpo    — path curvo desde (7,16) a (17,16.5), pasando por (13,18)
Aleta frontal  — path "M5.5 14.5 C3.5 15.5 3 17.5 5 18.5"
Aletas traseras — dos paths desde (17.5,17) y (16,17.5)
```

### Contenedor del logo

El ícono siempre vive dentro de un contenedor cuadrado redondeado:

```
w-10 h-10   (40×40 px)
rounded-2xl
bg-gradient-to-br from-ocean-300 to-ocean-700
shadow-lg shadow-ocean-700/40
```

El stroke del SVG es siempre `white` dentro del contenedor.

### Variantes de uso

| Contexto | Fondo del contenedor | Color del texto |
|---|---|---|
| Navbar / Footer (oscuro) | `from-ocean-300 to-ocean-700` | `text-white` |
| Sección clara (futuro) | `from-ocean-400 to-ocean-800` | `text-ocean-900` |

### Reglas de uso del logo

- **Espacio libre**: mantener al menos `8px` (`.gap-2.5` ≈ 10px) entre el contenedor y cualquier otro elemento
- **Tamaño mínimo**: el contenedor no debe reducirse por debajo de `32×32 px`
- **No distorsionar** la relación de aspecto del SVG mascota
- **No usar** el ícono del faro (Faro Punta Mogotes) como logotipo; es exclusivamente decoración de fondo del hero

---

## 2. Paleta de colores

### Ocean — Paleta primaria

Inspire en la profundidad y el movimiento del mar. Es la paleta principal de toda la identidad.

| Token | Hex | Uso principal |
|---|---|---|
| `ocean-900` | `#020030` | Fondo hero, footer, fondo profundo |
| `ocean-800` | `#03045E` | Navbar scrolled, fondos secundarios |
| `ocean-700` | `#023E8A` | Gradientes, event-header, botones nav |
| `ocean-600` | `#0077B6` | Botón "Hablemos por WhatsApp", scrollbar |
| `ocean-500` | `#0096C7` | Íconos en cards claras, bordes |
| `ocean-400` | `#00B4D8` | **Botón CTA primario**, pulse-dot |
| `ocean-300` | `#48CAE4` | Gradient-text, feature icons, gradient inicio |
| `ocean-200` | `#90E0EF` | Texto secundario sobre fondos oscuros |
| `ocean-100` | `#ADE8F4` | Fondos de badges, icon containers |
| `ocean-50`  | `#CAF0F8` | Fondos de badges de sección muy claros |

### Sand — Paleta de acento cálido

Referencia a la arena de la playa. Usada únicamente como **acento**, nunca como color principal.

| Token | Hex | Uso |
|---|---|---|
| `sand-500` | `#D4B483` | Acento cálido fuerte |
| `sand-400` | `#E9D5A0` | Acento cálido medio |
| `sand-300` | `#F4E4C1` | Acento cálido suave |
| `sand-200` | `#F8EDD8` | Fondos cálidos muy suaves |
| `sand-100` | `#FEF9EE` | Fondos casi blancos con tinte arena |

### Neutral — Complementario

Usar tokens de Tailwind `slate-*` para texto, bordes y fondos en secciones claras:

| Uso | Token |
|---|---|
| Texto principal en claro | `slate-800` |
| Texto secundario | `slate-500`, `slate-600` |
| Bordes sutiles | `slate-100`, `slate-200` |
| Fondos de card clara | `slate-50` |

### Reglas de color

- **Contraste mínimo**: texto blanco solo sobre `ocean-700` o más oscuro
- **Gradient-text** (`.gradient-text`) únicamente sobre fondos claros o blancos; pierde legibilidad sobre fondos oscuros
- **Hero-bg** (`.hero-bg`) solo para la sección hero y el navbar; no reutilizar en otras secciones
- La paleta sand **no reemplaza** al ocean como color principal en ningún contexto

---

## 3. Tipografía

### Display — Space Grotesk

Para títulos, headings, wordmark, badges de sección y labels de navegación.

| Uso | Clase Tailwind | Peso |
|---|---|---|
| Hero H1 | `text-5xl md:text-6xl lg:text-7xl` | `font-bold` (700) |
| Sección H2 | `text-4xl md:text-5xl` | `font-bold` (700) |
| Card H3 | `text-lg` o `text-xl` | `font-bold` (700) |
| Footer H4 | `text-base` | `font-semibold` (600) |
| Wordmark nav | `text-xl` | `font-bold` (700) |

Aplicar con: `font-display font-bold` (el token `font-display` resuelve a `Space Grotesk`).

### Body — Inter

Para párrafos, descripciones, links de navegación, texto de footer.

| Uso | Clase Tailwind | Peso |
|---|---|---|
| Subtítulo hero | `text-xl md:text-2xl` | `font-normal` (400) |
| Copy de sección | `text-lg` | `font-normal` (400) |
| Texto de card | `text-sm` | `font-medium` (500) |
| Nav links | `text-sm` | `font-medium` (500) |
| Labels uppercase | `text-xs tracking-widest` | `font-semibold` (600) |

Aplicar con: `font-sans` (el token `font-sans` resuelve a `Inter`).

### Reglas tipográficas

- **No mezclar** ambas fuentes dentro de un mismo elemento de texto
- Los labels en `UPPERCASE` siempre usan `tracking-widest` para mantener legibilidad
- `line-height` para párrafos largos: `leading-relaxed`
- `line-height` para títulos grandes: `leading-[1.1]`

---

## 4. Tono y voz

### Personalidad de la marca

MdPDev habla como un **colega de confianza** que conoce bien la escena tech de la ciudad: cercano, directo, entusiasmado con lo que construye, y orgulloso de ser de acá.

### Principios

| Principio | Descripción | Ejemplo |
|---|---|---|
| **Directo y cercano** | Tuteo, primera persona del plural | "Conectamos", "Impulsamos", "Hablemos" |
| **Local con orgullo** | Identidad costera y marplatense | "la costa atlántica", "ecosistema tech de Mar del Plata" |
| **Accesible** | Sin jerga excesiva, inclusivo | Evitar siglas sin explicar |
| **Orientado a la acción** | CTAs activos y en imperativo | "Unirse", "Ver Eventos", "Hablemos por WhatsApp" |
| **Optimista** | Futuro posible, no promesas vacías | "Impulsamos el talento local" |

### Lo que MdPDev NO es

- Corporativo o formal en exceso
- Frío o distante
- Genérico o intercambiable con otra comunidad
- Excluyente o elitista

### Ejemplos de copy

| Contexto | Correcto | Incorrecto |
|---|---|---|
| CTA principal | "Unirse a la comunidad" | "Register Now" / "Sign Up" |
| Subtítulo hero | "Conectamos desarrolladores, diseñadores y emprendedores en Mar del Plata" | "La plataforma líder de networking tech" |
| Call para colaboradores | "¿Tu organización quiere impulsar el tech de la costa?" | "Oportunidades de patrocinio disponibles" |
| Descripción del evento | "Un encuentro para conectar y compartir" | "Networking event for professionals" |

---

## 5. Componentes UI

### Botones

#### Primario — CTA principal
```
bg-ocean-400 hover:bg-ocean-300
text-white
px-8 py-4
rounded-full
font-semibold text-lg
transition-all
hover:shadow-2xl hover:shadow-ocean-400/40
hover:-translate-y-1
```
Usado para: "Unirse a la comunidad" en hero y navbar.

#### Secundario — outline
```
border border-ocean-400/50
text-ocean-200 hover:text-white
hover:bg-ocean-800/60 hover:border-ocean-300
px-8 py-4
rounded-full
font-semibold text-lg
backdrop-blur-sm
hover:-translate-y-1
```
Usado sobre fondos oscuros (hero).

#### WhatsApp
```
bg-ocean-600 hover:bg-ocean-700
text-white
px-8 py-4
rounded-full
font-semibold text-lg
hover:shadow-xl hover:shadow-ocean-600/30
hover:-translate-y-0.5
```
Siempre acompañado del ícono SVG de WhatsApp inline.

#### Navbar (compacto)
```
bg-ocean-400 hover:bg-ocean-300
text-white
px-5 py-2.5
rounded-full
text-sm font-semibold
hover:shadow-lg hover:shadow-ocean-400/40
```

### Cards

#### Card oscura (hero features)
```
bg-ocean-800/50
backdrop-blur-sm
border border-ocean-600/30
rounded-2xl
p-5
```
Íconos en contenedor `w-12 h-12 bg-ocean-600/40 rounded-xl`.

#### Card clara (colaboradores, secciones light)
```
bg-slate-50
border border-slate-100
rounded-2xl
p-7
hover:-translate-y-1
hover:shadow-lg hover:shadow-ocean-600/10
transition-all duration-300
```

#### Card de equipo
```
bg-white
rounded-3xl
border border-slate-100
shadow-sm
p-7
hover:-translate-y-1.5
hover:shadow-xl hover:shadow-ocean-600/10
transition-all duration-300
```
Avatar: `w-20 h-20 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-800 font-display font-bold text-2xl text-white`.

### Badges

#### Badge de sección (encima del H2)
```
inline-flex items-center gap-2
bg-ocean-50 text-ocean-700
rounded-full
px-4 py-2
text-sm font-semibold
```

#### Badge inline (dentro de card)
```
inline-flex items-center gap-1
bg-ocean-100 text-ocean-700
rounded-full
px-3 py-1
text-xs font-semibold
```

### Animaciones disponibles

| Clase | Efecto | Duración |
|---|---|---|
| `.wave-drift` | Traslación horizontal infinita (olas) | 16s linear |
| `.float-1` | Levitación suave | 5s ease-in-out |
| `.float-2` | Levitación suave (delay 1.2s) | 5s ease-in-out |
| `.float-3` | Levitación suave (delay 2.4s) | 5s ease-in-out |
| `.pulse-dot` | Ring pulsante en `ocean-400` | 2.2s ease-in-out |

---

## 6. Do's & Don'ts

### Logo

| Do | Don't |
|---|---|
| Usar siempre el wordmark completo "MdPDev" | Escribir "mdpdev", "MDP Dev" o "Mdp dev" |
| Mantener el ratio del contenedor cuadrado | Estirar o aplanar el contenedor |
| Respetar el espacio libre de 8px mínimo | Superponer texto u otros elementos sobre el logo |
| Usar el faro como decoración de fondo (hero) | Usar el faro como ícono de la marca |

### Color

| Do | Don't |
|---|---|
| Texto blanco sobre `ocean-700+` | Texto blanco sobre `ocean-400` o más claro |
| `.gradient-text` sobre fondos blancos o muy claros | `.gradient-text` sobre fondos oscuros |
| `.hero-bg` solo en la sección hero y navbar | Reutilizar `.hero-bg` en secciones internas |
| Sand como acento puntual | Sand como color de fondo de sección completa |

### Tipografía

| Do | Don't |
|---|---|
| Space Grotesk para headings, Inter para cuerpo | Mezclar ambas fuentes en el mismo bloque |
| `tracking-widest` en labels uppercase | Labels uppercase sin tracking extra |
| `leading-[1.1]` en títulos grandes | Títulos grandes con `leading-normal` (muy separados) |

### Voz

| Do | Don't |
|---|---|
| "Unirse a la comunidad" | "Join our community" (en inglés) |
| "la costa atlántica" | "la región" (genérico) |
| Tuteo o primera persona del plural | Tercera persona formal |
