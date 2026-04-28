# Red — proyectos, ideas y módulos comunitarios

Sección **Red** de la app: directorio colectivo de proyectos open-source que
construye la comunidad de Mar del Plata, junto con el tablero de ideas que
los precede y un registro de módulos reutilizables que los proyectos pueden
consumir entre sí.

La premisa es **comunitaria**: ningún proyecto tiene "owner" individual. Los
contributors son la autoridad operativa y los maintainers (rol opt-in que
arranca en `null`) son la última palabra para acciones destructivas.

---

## Vocabulario

| Término | Significado |
|---|---|
| **Project** | Algo concreto que se está construyendo. Tiene contributors, repo, demo. |
| **Idea** | Posible proyecto. Existe antes de que haya código. Se puede linkear a uno o más projects cuando se la implementa. |
| **Module** | Pieza de funcionalidad reutilizable que un project expone (ej: auth-flow, billing). Otros projects la consumen vía `module_usages`. |
| **Contributor** | Usuario que está construyendo un project. Puede editar campos. |
| **Maintainer** | Subset de contributors con permiso para archivar/borrar. Empieza en `null`; la comunidad asigna después. |
| **Follower** | Usuario que sigue un project o idea — solo notificaciones, sin permisos. |

Las ideas **no se convierten** en projects: si una idea cobra vida, se crea
un project nuevo y se hace `idea_projects` con `link_type = 'implements'`.
Ambas entidades coexisten sin reemplazarse.

---

## Modelo de datos

### Projects

```sql
projects
  id            uuid pk
  slug          text unique
  name          text not null
  description   text
  status        text not null default 'active'  -- active | paused | archived
  repo_url      text
  demo_url      text
  is_public     boolean default true
  created_by    uuid → profiles.id              -- audit only, no permisos
  created_at    timestamptz default now()
  updated_at    timestamptz default now()
```

```sql
project_followers
  project_id    uuid → projects.id  on delete cascade
  user_id       uuid → profiles.id  on delete cascade
  created_at    timestamptz default now()
  primary key (project_id, user_id)
```

```sql
project_contributors
  project_id    uuid → projects.id  on delete cascade
  user_id       uuid → profiles.id  on delete cascade
  role          text not null default 'contributor'  -- contributor | maintainer
  joined_at     timestamptz default now()
  primary key (project_id, user_id)
```

```sql
project_changes
  id            uuid pk default gen_random_uuid()
  project_id    uuid → projects.id  on delete cascade
  kind          text not null  -- feature | fix | chore | note
  title         text not null
  body          text
  ref_url       text           -- link a PR/commit/release
  author_id     uuid → profiles.id
  created_at    timestamptz default now()
```

```sql
project_comments
  id            uuid pk default gen_random_uuid()
  project_id    uuid → projects.id  on delete cascade
  parent_id     uuid → project_comments.id  null  -- threading 1-nivel
  author_id     uuid → profiles.id
  body          text not null
  created_at    timestamptz default now()
  updated_at    timestamptz default now()
  deleted_at    timestamptz null   -- soft-delete: el body se oculta pero el thread sobrevive
```

### Ideas

```sql
ideas
  id            uuid pk
  slug          text unique
  title         text not null
  description   text
  tags          text[] default '{}'
  status        text not null default 'open'   -- open | active | archived
                                               -- 'active' = tiene al menos un project linkeado con type 'implements'
  created_by    uuid → profiles.id
  created_at    timestamptz default now()
  updated_at    timestamptz default now()
```

```sql
idea_followers
  idea_id       uuid → ideas.id  on delete cascade
  user_id       uuid → profiles.id  on delete cascade
  created_at    timestamptz default now()
  primary key (idea_id, user_id)
```

```sql
idea_projects
  idea_id       uuid → ideas.id  on delete cascade
  project_id    uuid → projects.id  on delete cascade
  link_type     text not null  -- related | implements
  linked_by     uuid → profiles.id
  linked_at     timestamptz default now()
  primary key (idea_id, project_id)
```

### Módulos (Etapa 3)

```sql
modules
  id            uuid pk
  project_id    uuid → projects.id  on delete cascade  -- el project que expone el módulo
  slug          text not null
  name          text not null
  description   text
  source_url    text  -- link al código (carpeta del repo, package, etc)
  version       text  -- semver libre o equivalente
  license       text
  is_public     boolean default true
  created_at    timestamptz default now()
  updated_at    timestamptz default now()
  unique (project_id, slug)
```

```sql
module_usages
  module_id     uuid → modules.id  on delete cascade
  project_id    uuid → projects.id  on delete cascade  -- el project que CONSUME
  status        text not null default 'declared'  -- declared | active | deprecated
  declared_at   timestamptz default now()
  primary key (module_id, project_id)
```

---

## Permisos

Resumen de quién puede hacer qué. Implementado vía RLS (row-level security)
en Supabase.

| Acción | Quién |
|---|---|
| Listar projects/ideas/modules públicos | cualquiera (anon) |
| Listar projects con `is_public = false` | solo contributors del project |
| Crear project / idea / module | cualquier `auth.users` |
| Editar campos de un project | `project_contributors` (cualquier role) |
| Archivar / borrar project | `project_contributors` con `role = 'maintainer'` |
| Sumarse como contributor | cualquier `auth.users` (auto-join) |
| Promover a maintainer | otro maintainer existente. Si no hay ninguno, cualquier contributor (la primera promoción es libre). |
| Editar idea | `created_by` o cualquier contributor de un project linkeado con `link_type = 'implements'` |
| Linkear idea ↔ project | cualquier `auth.users` (es metadata, no destructivo) |
| Comentar | cualquier `auth.users` |
| Borrar comment propio | `author_id = auth.uid()` (soft-delete) |
| Borrar comment ajeno | maintainers del project |
| Importar módulo (crear `module_usages`) | contributors del project que consume |

Nota: auto-join como contributor abre la puerta al spam. Para una comunidad
chica es aceptable; si crece se agrega un paso de aprobación opcional sin
cambiar el modelo (un campo `joined_status: 'pending' | 'active'`).

---

## Information architecture

### Sidebar (pillar **Red**)

| Tab | Ruta |
|---|---|
| Open source | `/red` (default — directorio público) |
| Mis proyectos | `/red/mis-proyectos` (sigo + soy contributor) |
| Ideas | `/red/ideas` |
| Módulos | `/red/modulos` (Etapa 3) |

### Páginas

- `/red` — grid de cards de projects públicos. Filtros por status + search.
- `/red/mis-proyectos` — mismas cards pero filtradas por `followers + contributors`.
- `/red/ideas` — grid de ideas. Filtros: todas / sigo / creé.
- `/red/modulos` — grid de módulos públicos.

### Sheet del proyecto (bottom sheet, 90vh)

Disparado por click en una `ProjectCard`. Patrón replicado de
`aeterna-monorepo/apps/estudio/components/core-ui/DetailSheetComponents.tsx`
pero sin Radix — implementación custom con animación slide-up y backdrop.

Estructura interna:

```
┌──────────────────────────────────────────────────┐
│  Header (sticky)                                  │
│  ├ drag-handle bar                                │
│  ├ title + status badge                           │
│  ├ counters (followers · contributors · módulos)  │
│  └ acciones (Seguir, Sumarme, Editar, Cerrar)    │
├──────────────────────────────────────────────────┤
│  Tabs (sticky bajo el header)                     │
│   Overview · Construyendo · Módulos · Ideas      │
│   · Cambios · Comments                            │
├──────────────────────────────────────────────────┤
│  Content (scroll)                                 │
└──────────────────────────────────────────────────┘
```

El sheet **no cambia la URL** por default (es un overlay sobre la lista).
Opcional: mantener un query param `?p=<slug>` para que se pueda compartir
el link de un sheet abierto (parseamos el query al montar y abrimos el
sheet correspondiente).

### Sheet de la idea

Mismo patrón pero con menos tabs:

```
Header  · title · status · counters
Tabs    · Descripción · Proyectos · Comments
Content · scroll
```

---

## Flujos clave

### 1. Crear proyecto

1. Usuario logueado clickea **+ Nuevo proyecto** en `/red`.
2. Form: name (auto-genera slug), description, repo_url, demo_url, is_public.
3. Submit:
   - inserta `projects` con `created_by = auth.uid()`
   - inserta `project_contributors (project_id, user_id, role='contributor')`
     — el creator queda como contributor automáticamente, **sin role
     maintainer**. Es la regla "maintainer arranca en null".
4. Redirige al directorio con el sheet del nuevo project abierto.

### 2. Sumarse como contributor

1. En el tab **Construyendo** del sheet, botón "Sumarme a construir".
2. Inserta `project_contributors` con role `'contributor'`. Auto-confirmado.
3. El usuario gana permiso de edición sobre los campos del project.

### 3. Linkear una idea a un proyecto

1. Desde el sheet de la idea, tab **Proyectos**, botón "Linkear a proyecto".
2. Modal con autocomplete de projects.
3. Elige link_type:
   - **implements** — "este proyecto la está construyendo"
     → si la idea está en `status = 'open'`, pasa a `'active'` automáticamente
       (trigger SQL).
   - **related** — "tiene cosas que ver"
4. Se crea `idea_projects (idea_id, project_id, link_type, linked_by)`.
5. Aparece en ambos sheets (tab Ideas del project / tab Proyectos de la idea).

### 4. Comentar en un proyecto

1. Sheet del project, tab **Comments**.
2. Lista de comments raíz (parent_id IS NULL) ordenados por `created_at desc`,
   cada uno con sus respuestas (parent_id = comment.id) en orden ascendente.
3. Composer al pie. Markdown liviano (bold, italic, links, código inline).
4. Edit/delete propios disponibles vía menú contextual; delete es
   soft-delete (`deleted_at`).

### 5. Importar un módulo (Etapa 3)

1. En `/red/modulos`, contributor de un project ve un módulo de otro project.
2. Botón "Usar en mi proyecto" → autocomplete de projects donde es contributor.
3. Inserta `module_usages (module_id, project_id, status='declared')`.
4. Aparece como dependencia en el tab **Módulos** del project consumidor
   y como uso en el tab **Módulos** del project que expone.

---

## RLS — patterns por tabla

(Esquema; las migrations expanden cada policy.)

```
projects
  SELECT  : is_public = true OR auth.uid() in project_contributors
  INSERT  : auth.role() = 'authenticated'
  UPDATE  : auth.uid() in project_contributors
  DELETE  : auth.uid() in project_contributors WHERE role = 'maintainer'

project_contributors
  SELECT  : true (lista de contributors es pública)
  INSERT  : auth.uid() = user_id  (sólo te sumás vos mismo)
  UPDATE  : auth.uid() in (project_contributors WHERE role='maintainer')
  DELETE  : auth.uid() = user_id  OR  auth.uid() in maintainers

project_followers
  SELECT  : auth.uid() = user_id  (cada uno ve sólo lo suyo)
  INSERT  : auth.uid() = user_id
  DELETE  : auth.uid() = user_id

ideas / idea_followers / idea_projects
  ≈ similar pattern, ajustado a created_by + linked_by

project_comments
  SELECT  : project es visible para el usuario (mismas reglas que projects)
  INSERT  : auth.role() = 'authenticated'
  UPDATE  : auth.uid() = author_id
  DELETE  : auth.uid() = author_id  OR  auth.uid() in maintainers
```

---

## Etapas de implementación

### Etapa 1 — schema + UI base
- migrations: projects, project_*, ideas, idea_*, project_comments
- páginas: `/red`, `/red/mis-proyectos`, `/red/ideas`
- componentes: ProjectCard, IdeaCard, formularios crear-proyecto / crear-idea
- follow / unfollow + sumarse como contributor

### Etapa 2 — sheet + interacciones
- componente `BottomSheet` (custom, animación slide-up 90vh)
- `ProjectSheet` con sus 6 tabs
- `IdeaSheet` con sus 3 tabs
- linkear idea ↔ project
- comments con threading 1-nivel

### Etapa 3 — módulos
- migrations: modules, module_usages
- `/red/modulos` registry
- tab Módulos del ProjectSheet
- flow "importar módulo"

---

## Decisiones diferidas

- **Auto-sync GitHub** para changelog (`project_changes`): manual en MVP. Si
  más adelante un project conecta su repo via webhook, los commits con
  prefix `feat:`/`fix:` pueden insertarse como entries.
- **Aprobación previa para sumarse como contributor**: queda en auto-join
  hasta que aparezca spam.
- **Versionado real de módulos** (tabla `module_versions` con semver): solo
  cuando algún módulo tenga 3+ usages activas.
- **Notificaciones**: out of scope para MVP. Followers no reciben nada todavía.
