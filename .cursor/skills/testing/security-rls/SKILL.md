---
name: security-rls
description: Verificar Row Level Security, migraciones de seguridad y políticas Supabase. Usar al tocar scripts SQL, RLS o tablas con datos sensibles.
paths:
  - "scripts/**"
  - "src/lib/supabase/**"
---

# Security & RLS — MdPDev

## Misión

Asegurar que cambios de base de datos no expongan datos sensibles ni rompan políticas de seguridad.

## Scripts disponibles

```bash
npm run security:verify       # scripts/verify-rls.mjs
npm run security:regression   # scripts/regression-rls.mjs
npm run security:migrate      # scripts/apply-security-migrations.mjs
```

**Requiere** credenciales Supabase en `.env.local` o secrets del entorno.

## Reglas de migración

- Toda tabla con `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- Policies con nombres descriptivos; `DROP POLICY IF EXISTS` antes de recrear
- Vistas públicas sin columnas sensibles (`email`, `is_admin`, `added_by`)
- `SECURITY DEFINER` solo en helpers necesarios (`is_admin()`)
- `search_path` fijado en funciones (ver `scripts/017_function_search_path.sql`)

## Checklist por tabla nueva

- [ ] RLS habilitado
- [ ] Policy de lectura pública solo en vista `*_public` o filas `published`
- [ ] Policy de escritura restringida (`auth.uid()`, `is_admin()`)
- [ ] Tipo TS sincronizado con schema
- [ ] `ARCHITECTURE.md` §7 actualizado

## Auditoría manual

Revisar `scripts/012_security_audit_check.sql` y migraciones recientes en `scripts/`.

## Ante fallo de verify/regression

1. No mergear hasta resolver
2. Documentar qué policy falló
3. Crear issue Linear con riesgo High si es exposición de datos

## Referencias

- Esquema completo: `ARCHITECTURE.md` §7
- Rule: `.cursor/rules/10-nomad-hub-data.mdc`
