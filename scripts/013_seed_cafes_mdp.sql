-- Seed curado de cafés aptos a nómades digitales en Mar del Plata.
-- Datos reales recopilados de listados públicos (laptopfriendly.co — "free wifi,
-- ample power sockets, comfy seating"; TimeOut/Ohlalá/InfoViajera para café de
-- especialidad; sitios oficiales de los coworks-café). Priorizado para coworking:
-- wifi estable, enchufes y que te dejan quedarte horas.
-- NO incluye ratings de Google (quedan null; los aporta la comunidad votando).
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de scripts/012_cafes.sql.
-- Idempotente: re-ejecutable sin duplicar (guard por nombre).
-- Revisar/ajustar direcciones y barrios antes de correr si hace falta.

INSERT INTO public.cafes (name, neighborhood, address, maps_url, source)
SELECT v.name, v.neighborhood, v.address, v.maps_url, 'seed'
FROM (
  VALUES
    -- Híbridos café + coworking (lo más apto para trabajar horas / pase diario)
    ('GoCompany (ex Blend) — café & cowork', 'Centro', 'Cerca de Plaza Mitre',
     'https://www.google.com/maps/search/?api=1&query=GoCompany%20cafe%20cowork%20Mar%20del%20Plata'),
    ('Ola Cowork', 'Constitución', 'Zona Constitución (pase diario + café)',
     'https://www.google.com/maps/search/?api=1&query=Ola%20Cowork%20Mar%20del%20Plata'),
    ('Work Café Santander', 'Centro', 'Zona Belgrano',
     'https://www.google.com/maps/search/?api=1&query=Work%20Caf%C3%A9%20Santander%20Mar%20del%20Plata'),
    -- Cafés work-friendly (wifi + enchufes + asientos cómodos)
    ('FOLC Coffee Company (Playa Grande)', 'Playa Grande', 'Formosa 254',
     'https://www.google.com/maps/search/?api=1&query=FOLC%20Coffee%20Company%20Formosa%20254%20Mar%20del%20Plata'),
    ('FOLC Coffee Company (Centro)', 'Centro', 'San Martín 2927',
     'https://www.google.com/maps/search/?api=1&query=FOLC%20Coffee%20Company%20San%20Mart%C3%ADn%202927%20Mar%20del%20Plata'),
    ('Kersen (Playa Grande)', 'Playa Grande', 'Leandro N. Alem 3407',
     'https://www.google.com/maps/search/?api=1&query=Kersen%20Alem%203407%20Mar%20del%20Plata'),
    ('Kersen (Centro)', 'Centro', 'Garay 1755',
     'https://www.google.com/maps/search/?api=1&query=Kersen%20Garay%201755%20Mar%20del%20Plata'),
    ('No Coffee No Prana', 'Playa Grande', '14 de Julio 2479',
     'https://www.google.com/maps/search/?api=1&query=No%20Coffee%20No%20Prana%20Mar%20del%20Plata'),
    ('Tempo Café', 'Centro', 'La Rioja 1954',
     'https://www.google.com/maps/search/?api=1&query=Tempo%20Caf%C3%A9%20La%20Rioja%201954%20Mar%20del%20Plata'),
    ('Chauvin Centro de Creación', 'Centro', 'San Luis 2849',
     'https://www.google.com/maps/search/?api=1&query=Chauvin%20San%20Luis%202849%20Mar%20del%20Plata'),
    ('La Fonte D''Oro (Playa Grande)', 'Playa Grande', 'Paseo Victoria Ocampo, Playa Grande',
     'https://www.google.com/maps/search/?api=1&query=La%20Fonte%20D%27Oro%20Playa%20Grande%20Mar%20del%20Plata'),
    ('La Fonte D''Oro (La Perla)', 'La Perla', 'Av. Juan José Paso 2430',
     'https://www.google.com/maps/search/?api=1&query=La%20Fonte%20D%27Oro%20Juan%20Jos%C3%A9%20Paso%202430%20Mar%20del%20Plata'),
    ('Weiss Break & Brunch', 'La Perla', 'Av. Juan José Paso 2107',
     'https://www.google.com/maps/search/?api=1&query=Weiss%20Break%20and%20Brunch%20Mar%20del%20Plata'),
    ('ATC — Acá Tomamos Café', 'Centro', 'Av. Pedro Luro 2599',
     'https://www.google.com/maps/search/?api=1&query=Ac%C3%A1%20Tomamos%20Caf%C3%A9%20Pedro%20Luro%202599%20Mar%20del%20Plata'),
    ('Bendito Pedro', 'Centro', 'Córdoba 2429',
     'https://www.google.com/maps/search/?api=1&query=Bendito%20Pedro%20C%C3%B3rdoba%20Mar%20del%20Plata'),
    ('Café Delirante', 'Centro', 'Bartolomé Mitre 500',
     'https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Delirante%20Mitre%20500%20Mar%20del%20Plata'),
    ('Café Martínez (Güemes)', 'Güemes', 'Calle Güemes',
     'https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Mart%C3%ADnez%20G%C3%BCemes%20Mar%20del%20Plata'),
    ('Dinette Bistrot', 'Centro', 'Alvarado 1702',
     'https://www.google.com/maps/search/?api=1&query=Dinette%20Alvarado%201702%20Mar%20del%20Plata'),
    ('Mademoiselle Dinette', 'Playa Grande', 'Leandro N. Alem 3480',
     'https://www.google.com/maps/search/?api=1&query=Mademoiselle%20Dinette%20Alem%203480%20Mar%20del%20Plata')
) AS v(name, neighborhood, address, maps_url)
WHERE NOT EXISTS (
  SELECT 1 FROM public.cafes c WHERE c.name = v.name
);
