-- Columna de descripción ("qué ofrecen / menú"). Ejecutar en Supabase. Idempotente.
ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS description TEXT;
