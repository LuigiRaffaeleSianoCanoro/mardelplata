-- Remove mistaken sponsor preset (was /avatar-icons/whatsapp-02.png) from saved profile avatars.
-- Run in Supabase SQL Editor after deploy. Safe to re-run.

UPDATE public.profiles
SET avatar_url = NULL
WHERE avatar_url IS NOT NULL
  AND (
    lower(avatar_url) LIKE '%avatar-icons/whatsapp-02.png%'
    OR lower(avatar_url) LIKE '%avatar-icons%2fwhatsapp-02.png%'
  );
