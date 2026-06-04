-- Distingue cafés de coworks puros + siembra los coworks.
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de 012 y 013. Idempotente.

ALTER TABLE public.cafes
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'cafe'
  CHECK (kind IN ('cafe', 'cowork'));

INSERT INTO public.cafes (name, neighborhood, address, maps_url, source, kind)
SELECT v.name, v.neighborhood, v.address, v.maps_url, 'seed', 'cowork'
FROM (
  VALUES
    ('Indie Coworking', 'Distrito Tecnológico', 'Chaco 1670',
     'https://www.google.com/maps/search/?api=1&query=Indie%20Coworking%20Chaco%201670%20Mar%20del%20Plata'),
    ('BIX Cowork', 'Centro', 'Avellaneda 2325',
     'https://www.google.com/maps/search/?api=1&query=BIX%20Cowork%20Avellaneda%202325%20Mar%20del%20Plata'),
    ('LINE UP Cowork', 'Centro', 'Mar del Plata',
     'https://www.google.com/maps/search/?api=1&query=LINE%20UP%20Cowork%20Mar%20del%20Plata')
) AS v(name, neighborhood, address, maps_url)
WHERE NOT EXISTS (
  SELECT 1 FROM public.cafes c WHERE c.name = v.name
);
