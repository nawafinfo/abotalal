
-- 1. Bookings: enforce user_id = auth.uid()
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.bookings;
CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 2. Orders
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;
CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Package subscriptions
DROP POLICY IF EXISTS "Authenticated users can create subscriptions" ON public.package_subscriptions;
CREATE POLICY "Users can create their own subscriptions" ON public.package_subscriptions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 4. Wifi orders
DROP POLICY IF EXISTS "Authenticated users can create wifi orders" ON public.wifi_orders;
CREATE POLICY "Users can create their own wifi orders" ON public.wifi_orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 5. Referrals: enforce referrer_id = auth.uid()
DROP POLICY IF EXISTS "Authenticated users can create referrals" ON public.referrals;
CREATE POLICY "Users can create their own referrals" ON public.referrals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);

-- 5b. Hide referred_email from referrers via a view; restrict direct SELECT to admins
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referrals;
CREATE POLICY "Admins can view all referrals rows" ON public.referrals
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE VIEW public.my_referrals AS
  SELECT id, referrer_id, referred_user_id, status, points_awarded, created_at,
         -- mask email: keep first char + domain
         CASE WHEN referred_email IS NULL THEN NULL
              ELSE regexp_replace(referred_email, '(^.).*(@.*$)', '\1***\2')
         END AS referred_email_masked
  FROM public.referrals
  WHERE referrer_id = auth.uid();

GRANT SELECT ON public.my_referrals TO authenticated;

-- Allow referrers to still see their own rows but restrict column select via a policy exposing all cols;
-- Since Postgres RLS can't restrict columns, add a per-row policy but revoke SELECT on the email column.
CREATE POLICY "Users can view own referrals (no email)" ON public.referrals
  FOR SELECT TO authenticated USING (auth.uid() = referrer_id);

REVOKE SELECT (referred_email) ON public.referrals FROM authenticated;

-- 6. user_points: prevent self-update of balance
DROP POLICY IF EXISTS "Users can update own points" ON public.user_points;
DROP POLICY IF EXISTS "System can insert points" ON public.user_points;
-- Only admins can insert/update; SELECT policy remains

-- 7. user_roles: add explicit block on self-insert by adding a restrictive policy
--   The existing "Admins can manage roles" ALL policy with USING already blocks non-admins,
--   but INSERT relies on WITH CHECK. Add explicit restrictive policy.
CREATE POLICY "Only admins can insert roles" ON public.user_roles
  AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles" ON public.user_roles
  AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles" ON public.user_roles
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. has_role: revoke execute from PUBLIC and anon (keep for authenticated for RLS + RPC)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- 9. Storage: chat-media policies
CREATE POLICY "Users can upload chat media to own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'chat-media'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own chat media"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'chat-media'
    AND (
      (auth.uid())::text = (storage.foldername(name))[1]
      OR has_role(auth.uid(), 'admin'::app_role)
    )
  );

CREATE POLICY "Users can delete own chat media"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'chat-media'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- 10. Storage: app-files policies (admin-managed)
CREATE POLICY "Admins can manage app-files"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'app-files' AND has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'app-files' AND has_role(auth.uid(), 'admin'::app_role));

-- 11. Public bucket listing: drop broad SELECT policies (files remain accessible via public URLs)
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view portfolio files" ON storage.objects;

-- Make buckets private-listing (files served through public CDN URLs still work for public buckets)
-- but we mark buckets as public so unauthenticated URL fetches keep working.
