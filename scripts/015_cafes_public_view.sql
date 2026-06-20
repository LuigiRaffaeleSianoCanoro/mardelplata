-- Vista pública de cafés/coworkings con señales agregadas de la comunidad.
-- Une `cafes` con un resumen de `cafe_votes` (cuántos votaron WiFi/enchufes/
-- asientos/silencio + score). NO expone `added_by` (igual criterio que
-- profiles_public). security_invoker = on → respeta las RLS de las tablas base
-- (ambas tienen SELECT público). Ver F3 en docs/nomad-it-hub/02-feature-plan.md.

CREATE OR REPLACE VIEW public.cafes_public
WITH (security_invoker = true) AS
SELECT
  c.id,
  c.name,
  c.address,
  c.neighborhood,
  c.lat,
  c.lng,
  c.google_place_id,
  c.google_rating,
  c.google_reviews_count,
  c.maps_url,
  c.source,
  c.kind,
  c.description,
  c.created_at,
  c.updated_at,
  COALESCE(v.votes_total, 0)  AS votes_total,
  COALESCE(v.score, 0)        AS score,
  COALESCE(v.wifi_yes, 0)     AS wifi_yes,
  COALESCE(v.power_yes, 0)    AS power_yes,
  COALESCE(v.seating_yes, 0)  AS seating_yes,
  COALESCE(v.quiet_yes, 0)    AS quiet_yes
FROM public.cafes c
LEFT JOIN (
  SELECT
    cafe_id,
    COUNT(*)                                  AS votes_total,
    COALESCE(SUM(vote), 0)                     AS score,
    COUNT(*) FILTER (WHERE has_wifi)           AS wifi_yes,
    COUNT(*) FILTER (WHERE has_power)          AS power_yes,
    COUNT(*) FILTER (WHERE good_seating)       AS seating_yes,
    COUNT(*) FILTER (WHERE is_quiet)           AS quiet_yes
  FROM public.cafe_votes
  GROUP BY cafe_id
) v ON v.cafe_id = c.id;

GRANT SELECT ON public.cafes_public TO anon, authenticated;
