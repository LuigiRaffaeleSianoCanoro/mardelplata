# Integración con Directus CMS

Este proyecto usa [Directus](https://directus.io) como headless CMS para gestionar contenido dinámico.

## Variables de entorno requeridas

Copiar `.env.example` a `.env.local` y completar los valores:

```
DIRECTUS_URL=https://tu-instancia.directus.app
DIRECTUS_TOKEN=tu_static_token_aqui
```

## Opciones para levantar Directus

### Opción A: Directus Cloud (recomendado)
1. Crear cuenta en [directus.cloud](https://directus.cloud)
2. Crear un nuevo proyecto
3. Copiar la URL del proyecto y generar un Static Token en Settings → API Tokens

### Opción B: Self-hosted con Docker
```bash
docker run -p 8055:8055 \
  -e KEY=una-clave-secreta \
  -e SECRET=otro-secreto \
  -e DB_CLIENT=sqlite3 \
  -e DB_FILENAME=/directus/database/data.db \
  directus/directus
```

## Colecciones requeridas en Directus

### `eventos`
| Campo | Tipo | Descripción |
|---|---|---|
| `titulo` | String | Nombre del evento |
| `descripcion` | Text | Descripción del evento |
| `fecha` | DateTime | Fecha y hora del evento |
| `lugar` | String | Lugar donde se realiza |
| `imagen` | Image | Imagen del evento (opcional) |
| `status` | String | Estado: `published`, `draft`, `archived` |

## Webhook para revalidación en Vercel

Para que Vercel revalide la página automáticamente cuando se publica contenido:

1. En Vercel → Settings → Git → Deploy Hooks: crear un hook
2. En Directus → Settings → Flows: crear un flow con trigger HTTP y llamar al Deploy Hook de Vercel en `items.create` y `items.update` de la colección `eventos`
