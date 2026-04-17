-- One-time: clear NextSolution sponsor image from profile avatars (no longer a selectable preset).
-- Run in Supabase SQL Editor after deploy. Adjust URLs if your storage uses absolute URLs.

UPDATE public.profiles
SET avatar_url = NULL
WHERE avatar_url IN (
  '/avatar-icons/avatar_WhatsApp Image 2026-04-15 at 11.55.46.png',
  '/avatar-icons/avatar_WhatsApp%20Image%202026-04-15%20at%2011.55.46.png'
);
