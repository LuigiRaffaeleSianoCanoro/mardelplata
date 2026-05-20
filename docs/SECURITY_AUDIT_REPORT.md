# Reporte de auditoría de seguridad — MdPDev

**Fecha:** 2026-05-20  
**Alcance:** Auth, RLS Supabase, admin escalation, credenciales, app layer  
**Estado:** Fixes implementados en repo; migraciones 010/011/012 aplicadas en producción (012 via MCP, 2026-05-20)

---

## Resumen ejecutivo

Se confirmó el vector de ataque reportado: un usuario autenticado podía ejecutar `UPDATE profiles SET is_admin = true WHERE id = auth.uid()` si la base de datos tenía solo las policies de `001_create_profiles_and_events.sql`. El fix existía en el repo (`011_profiles_no_escalation.sql`) pero las migraciones se aplican manualmente y **no había verificación de que estuvieran en producción**.

Se implementaron:

- Scripts de diagnóstico y migración (`010` → `011` → `012`)
- Endurecimiento adicional en `012_profiles_admin_hardening.sql`
- Gate server-side en `/admin`, middleware root, guard de mock en producción
- Scripts npm: `security:verify`, `security:regression`, `security:migrate`
- Scan DeepSec (267 candidatos; triage AI pendiente de API key)

---

## Hallazgos por severidad

### Crítico — auto-promoción a admin (UPDATE)

| | |
|---|---|
| **Vector** | `PATCH /rest/v1/profiles?id=eq.{uid}` con `{ "is_admin": true }` |
| **Causa** | Policy `"Users can update own profile"` solo verificaba `auth.uid() = id`, no bloqueaba `is_admin` |
| **Fix** | `011_profiles_no_escalation.sql` — policy `profiles_update_own_no_escalation` |
| **Estado** | Script en repo; **aplicar en prod con `npm run security:migrate`** |

### Crítico — leak masivo de emails (anon SELECT)

| | |
|---|---|
| **Vector** | `GET /rest/v1/profiles?select=*` con anon key |
| **Causa** | Policy `"Public profiles are viewable by everyone"` + `GRANT SELECT TO anon` |
| **Fix** | `010_profiles_lock_down.sql` — revoca anon, crea vista `profiles_public` |
| **Estado** | Script en repo; **aplicar en prod** |

### Alto — INSERT con is_admin en signup

| | |
|---|---|
| **Vector** | `INSERT INTO profiles (..., is_admin) VALUES (..., true)` en callback/registro |
| **Causa** | Policy INSERT solo verificaba `auth.uid() = id` |
| **Fix** | `012_profiles_admin_hardening.sql` — policy `profiles_insert_own_no_admin` |
| **Estado** | Nuevo script; **aplicar en prod** |

### Alto — admin UI sin policy RLS para gestionar otros usuarios

| | |
|---|---|
| **Vector** | Admin toggle/delete en `AdminDashboard.tsx` fallaba silenciosamente o requería service_role manual |
| **Causa** | No existía policy para UPDATE/DELETE cross-user |
| **Fix** | `012` — `profiles_admin_update_others`, `profiles_admin_delete_others` |
| **Estado** | Implementado en script |

### Medio — gate de /admin solo client-side

| | |
|---|---|
| **Fix aplicado** | `src/app/admin/layout.tsx` ahora es Server Component con redirect antes de render |
| **Defense-in-depth** | `middleware.ts` root protege `/admin`, `/perfil`, `/asistencias` |

### Medio — miembros autenticados leen todos los emails

| | |
|---|---|
| **Antes (010)** | `profiles_select_authenticated USING (true)` |
| **Fix (012)** | `profiles_select_own` + `profiles_select_admin` |
| **Impacto** | Miembros normales solo ven su propia fila; admins ven todo |

### Bajo — mock mode con admin bypass

| | |
|---|---|
| **Fix aplicado** | `NEXT_PUBLIC_USE_MOCK_DATA=1` bloqueado en `NODE_ENV=production` |

### Bajo — newsletter POST abierto

| | |
|---|---|
| **Riesgo** | Spam/abuse en `/api/newsletter` |
| **Acción** | Opcional: rate limiting en Vercel/Upstash |

---

## Cambios implementados en el repo

### Base de datos (scripts/)

| Script | Propósito |
|--------|-----------|
| `010_profiles_lock_down.sql` | Cierra leak anon, crea `profiles_public` |
| `011_profiles_no_escalation.sql` | Bloquea self-escalation UPDATE |
| `012_profiles_admin_hardening.sql` | INSERT lock, admin cross-user, SELECT restringido, trigger hardening |
| `012_security_audit_check.sql` | Diagnóstico read-only de policies |

### Scripts Node

| Comando | Descripción |
|---------|-------------|
| `npm run security:verify` | Tests REST (anon leak, profiles_public) |
| `npm run security:regression` | Regresión post-migración |
| `npm run security:migrate` | Aplica 010 + 011 + 012 via `DATABASE_URL` |

### App layer

- [`middleware.ts`](../middleware.ts) — session refresh + redirect login en rutas protegidas
- [`src/app/admin/layout.tsx`](../src/app/admin/layout.tsx) — gate server-side
- [`src/lib/devMock.ts`](../src/lib/devMock.ts) — mock deshabilitado en producción

---

## DeepSec

Scan ejecutado: run `20260520124556-4bb8a24605057e49` — **267 candidatos** en 130 archivos.

Matchers más activos (pre-triage, muchos son false positives):

| Matcher | Hits | Notas |
|---------|------|-------|
| missing-auth | 106 | Rutas Next.js sin auth explícita; RLS es la barrera real |
| insecure-crypto | 86 | Falsos positivos en nombres de campos (`description`, etc.) |
| dev-auth-bypass | 12 | `devMock.ts` — mitigado con guard de producción |
| xss | 19 | Revisar manualmente; mayoría en contenido estático |

**Pendiente:** `deepsec process` requiere `AI_GATEWAY_API_KEY` o `OPENAI_API_KEY` en `.deepsec/.env.local`. Ver [vercel-setup.md](https://github.com/vercel-labs/deepsec/blob/main/docs/vercel-setup.md).

```bash
cd .deepsec
# Agregar AI_GATEWAY_API_KEY=vck_… en .env.local
npx deepsec process --project-id mardelplata
npx deepsec revalidate --concurrency 5
npx deepsec export --format md-dir --out ./findings
```

---

## Credenciales — checklist

| Asset | Estado | Acción |
|-------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | OK en client | Seguridad = RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | No en código app | Solo scripts locales |
| `.env.local` | **Vacío** — completar | Ver sección siguiente |
| Vercel env | Verificar manualmente | Service role NO debe estar en Vercel |

**Si 010 no estaba aplicado:** considerar rotar anon key (emails expuestos).

---

## Pasos para cerrar la auditoría en producción

### 1. Completar `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

`DATABASE_URL` → Supabase Dashboard → Settings → Database → Connection string (URI).

### 2. Aplicar migraciones

```bash
npm run security:migrate
```

O manualmente en SQL Editor: `010` → `011` → `012`.

### 3. Verificar

```bash
npm run security:verify
npm run security:regression
```

Y en SQL Editor: `scripts/012_security_audit_check.sql`.

### 4. Test manual del ataque (como usuario no-admin)

1. Login con cuenta de prueba sin admin
2. DevTools → intentar `supabase.from('profiles').update({ is_admin: true }).eq('id', userId)`
3. **Esperado:** error RLS / 0 rows updated
4. Intentar acceder a `/admin` → redirect a `/perfil`

### 5. Confirmar admin funciona

1. Login como admin existente
2. Toggle admin de otro usuario en `/admin` → debe funcionar
3. Scanner QR debe resolver perfiles por `qr_code`

---

## Arquitectura de defensa (post-fix)

```mermaid
flowchart TD
    subgraph client [Browser]
        A[AdminDashboard] --> B[Supabase JS anon key + JWT]
    end
    subgraph next [Next.js]
        C[middleware.ts] --> D[Session refresh + login redirect]
        E[admin/layout.tsx server] --> F[is_admin check]
    end
    subgraph supabase [Supabase Postgres]
        G[RLS profiles] --> H[profiles_update_own_no_escalation]
        G --> I[profiles_admin_update_others]
        G --> J[profiles_insert_own_no_admin]
        K[public.is_admin] --> L[events / attendance / newsletter]
    end
    B --> G
    D --> B
    F --> B
```

---

## Conclusión

La vulnerabilidad reportada es **real y reproducible** en bases con solo el script `001`. Los fixes ya existían parcialmente (010/011) pero faltaba aplicación garantizada, cobertura de INSERT, y policies para que el admin UI funcione correctamente vía RLS.

**Prioridad inmediata:** completar `.env.local` y ejecutar `npm run security:migrate` en producción.
