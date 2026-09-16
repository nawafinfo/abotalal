
-- Allow users to see their own role
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Switch has_role to SECURITY INVOKER (relies on user's own row via new policy above,
-- and on admin visibility via existing "Admins can view all roles" policy)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Rebuild view as SECURITY INVOKER (Postgres 15+)
DROP VIEW IF EXISTS public.my_referrals;
CREATE VIEW public.my_referrals
WITH (security_invoker = true) AS
  SELECT id, referrer_id, referred_user_id, status, points_awarded, created_at,
         CASE WHEN referred_email IS NULL THEN NULL
              ELSE regexp_replace(referred_email, '(^.).*(@.*$)', '\1***\2')
         END AS referred_email_masked
  FROM public.referrals
  WHERE referrer_id = auth.uid();

GRANT SELECT ON public.my_referrals TO authenticated;
