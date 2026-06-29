# GA4 Setup — MdPDev (MAR-11)

> Checklist para conectar Google Analytics 4 a mardelplata.dev.ar.

## 1. Crear propiedad GA4

1. Ir a [Google Analytics](https://analytics.google.com/)
2. Admin → Crear propiedad → **MdPDev — mardelplata.dev.ar**
3. Stream web: `https://mardelplata.dev.ar`
4. Copiar **Measurement ID** (formato `G-XXXXXXXXXX`)

## 2. Vercel

Agregar variable de entorno en Vercel (Production + Preview):

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Redeploy después de guardar.

## 3. Verificación en código

El componente [`src/components/GoogleAnalytics.tsx`](../../src/components/GoogleAnalytics.tsx) solo carga GA si `NEXT_PUBLIC_GA_ID` está definido.

Eventos custom en [`src/lib/analytics.ts`](../../src/lib/analytics.ts):

| Evento | Trigger |
|--------|---------|
| `whatsapp_click` | CTA WhatsApp (TrackedOutboundLink) |

## 4. Validación

1. Abrir sitio en producción con GA Debugger o Tag Assistant
2. Click en CTA WhatsApp → verificar evento `whatsapp_click` en GA4 Realtime
3. Documentar Measurement ID en runbook interno (no commitear)

## 5. Linear

Issue: **PSI-220** — `[chore] MAR-11 GA4 + eventos custom`

## KPIs Q3 (referencia)

Ver [`PLAN.md`](./PLAN.md): target 2000 visitas web/mes sep 2026.
