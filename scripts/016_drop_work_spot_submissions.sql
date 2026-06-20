-- Elimina la tabla `work_spot_submissions` (introducida en 014), superada por la
-- convergencia sobre `cafes` + `cafe_votes` (ver 015). Quedó sin uso en la app y
-- el linter la marcaba por su política INSERT permisiva (WITH CHECK true).
-- Idempotente.

DROP TABLE IF EXISTS public.work_spot_submissions;
