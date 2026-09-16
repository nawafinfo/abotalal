
REVOKE EXECUTE ON FUNCTION public.increment_app_downloads() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.sync_app_rating() FROM anon, authenticated, public;

DROP POLICY IF EXISTS "downloads_anyone_insert" ON public.app_downloads;
REVOKE INSERT ON public.app_downloads FROM anon;
CREATE POLICY "downloads_owner_insert" ON public.app_downloads FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
