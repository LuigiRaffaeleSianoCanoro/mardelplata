-- Hardening de seguridad: fija un search_path inmutable en las funciones que el
-- linter de Supabase marcó como "function_search_path_mutable" (lint 0011).
-- Todas referencian objetos con nombre totalmente calificado (public.*, auth.uid())
-- o no tocan tablas, así que `search_path = ''` es seguro (no rompe resolución).
-- handle_new_user() e is_admin() ya tenían search_path seteado (no se incluyen).

ALTER FUNCTION public.idea_status_from_links() SET search_path = '';
ALTER FUNCTION public.touch_updated_at() SET search_path = '';
ALTER FUNCTION public.is_project_contributor(uuid) SET search_path = '';
ALTER FUNCTION public.is_project_maintainer(uuid) SET search_path = '';
ALTER FUNCTION public.project_creator_as_contributor() SET search_path = '';
ALTER FUNCTION public.generate_qr_code() SET search_path = '';
ALTER FUNCTION public.set_updated_at() SET search_path = '';
