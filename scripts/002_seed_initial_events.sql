-- Seed the initial events that were previously hardcoded in Events.tsx
-- Run this once in Supabase SQL Editor

INSERT INTO events (title, subtitle, description, date, location, tags, registration_url, is_mystery, is_published)
VALUES (
  'ALEPH HACKATHON',
  'Mar del Plata',
  'Construí algo real en un solo día. Equipos de hasta 4 personas compiten en tracks de IA, cripto y biotecnología con un prize pool de $10.000 USD. Abierto a developers, diseñadores, PMs y builders de todos los niveles.',
  '2026-03-21 09:00:00+00',
  'Bar Fauno · Olavarría 3232',
  ARRAY['AI', 'Crypto', 'Biotech', '1 día', 'Gratis'],
  'https://lu.ma/78n9t2fp',
  false,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO events (title, codename, teaser, date, is_mystery, is_published)
VALUES (
  'COFFEE CRYPTO RAVE',
  'COFFEE CRYPTO RAVE',
  'Café, cripto y algo que todavía no podemos revelar. Algo se está cocinando en La Feliz.',
  '2026-06-01 20:00:00+00',
  true,
  true
)
ON CONFLICT DO NOTHING;

INSERT INTO events (title, codename, teaser, date, is_mystery, is_published)
VALUES (
  'MDP DEV DAY',
  'MDP DEV DAY',
  'Un día entero para la comunidad tech de Mar del Plata. Fecha, lugar y agenda: pronto.',
  '2026-07-01 09:00:00+00',
  true,
  true
)
ON CONFLICT DO NOTHING;
