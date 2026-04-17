-- Clear NextSolution sponsor image from profile avatars (matches any URL shape: site path, Supabase Storage, etc.).
-- Run in Supabase SQL Editor. Re-run safely after deploy if needed.

UPDATE public.profiles
SET avatar_url = NULL
WHERE avatar_url IS NOT NULL
  AND lower(avatar_url) LIKE '%whatsapp image 2026-04-15 at 11.55.46%';
