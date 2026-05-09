-- Permitir a admins leer / borrar suscriptores del newsletter desde el
-- panel /admin. Usa public.is_admin() (SECURITY DEFINER) creada en 001.

DROP POLICY IF EXISTS newsletter_subscribers_admin_select ON public.newsletter_subscribers;
CREATE POLICY newsletter_subscribers_admin_select
  ON public.newsletter_subscribers FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS newsletter_subscribers_admin_delete ON public.newsletter_subscribers;
CREATE POLICY newsletter_subscribers_admin_delete
  ON public.newsletter_subscribers FOR DELETE
  USING (public.is_admin());
