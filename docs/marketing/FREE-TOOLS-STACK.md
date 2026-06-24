# Stack Gratuito — Marketing MdPDev

Herramientas free forever (o free tier permanente) para marketing y autopublicación.

## Scheduler y API

### Buffer (principal)

- **Plan:** Free — $0
- **Canales:** 3 (recomendado: Instagram, X, LinkedIn)
- **Posts:** 10 programados por canal (se liberan al publicar)
- **API:** GraphQL en `https://api.buffer.com`, 3000 req/mes, 1 API key
- **Docs:** https://developers.buffer.com

**Setup:**

1. Crear cuenta en https://buffer.com
2. Conectar Instagram, X, LinkedIn
3. Settings → API → Generate API Key
4. Guardar en GitHub Secret: `BUFFER_API_KEY`
5. Ejecutar `node scripts/social/list-channels.mjs` para obtener channel IDs
6. Guardar IDs en GitHub Secrets: `BUFFER_CHANNEL_INSTAGRAM`, `BUFFER_CHANNEL_X`, `BUFFER_CHANNEL_LINKEDIN`

### Meta Business Suite (backup IG/FB)

- **Plan:** Gratis, ilimitado para FB + IG
- **Uso:** Backup manual o posts que Buffer no cubre
- **URL:** https://business.facebook.com

## Hosting y CI

### Vercel

- Hosting de mardelplata.dev.ar (ya activo)
- Env vars para GA4: `NEXT_PUBLIC_GA_ID`

### GitHub Actions

- Workflow: `.github/workflows/social-publish.yml`
- Cron: 3×/día para revisar queue
- Secrets necesarios: `BUFFER_API_KEY`, channel IDs

## Media

### Cloudinary (opcional)

- 25 créditos/mes free
- URLs públicas para imágenes en posts Buffer
- Alternativa: subir a `public/` en el repo y usar URL absoluta de mardelplata.dev.ar

## Analytics

### Google Analytics 4

- Gratis, ilimitado
- Crear propiedad para mardelplata.dev.ar
- Env: `NEXT_PUBLIC_GA_ID=G-XXXXXXXX`

## Diseño

### Canva Free

- Templates 1080×1080 (IG), 1200×627 (LinkedIn)
- Ver `VISUAL-TEMPLATES.md` para specs de color y logo

## Comunicación

| Canal | URL | Costo |
|-------|-----|-------|
| WhatsApp | Grupo comunidad | Gratis |
| Instagram | @mardelplata.dev.ar | Gratis |
| X | @Mardeldev | Gratis |
| LinkedIn | /company/mardelplata-dev | Gratis |

## Lo que NO usar (sin free tier real en 2026)

- Hootsuite — solo trial
- Later — solo trial
- Metricool free — sin LinkedIn en free tier
