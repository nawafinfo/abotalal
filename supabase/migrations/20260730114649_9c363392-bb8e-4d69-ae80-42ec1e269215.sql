
ALTER TABLE public.apps
  ADD COLUMN IF NOT EXISTS developer_name text,
  ADD COLUMN IF NOT EXISTS support_url text,
  ADD COLUMN IF NOT EXISTS support_email text,
  ADD COLUMN IF NOT EXISTS support_phone text,
  ADD COLUMN IF NOT EXISTS package_name text,
  ADD COLUMN IF NOT EXISTS requirements text,
  ADD COLUMN IF NOT EXISTS whats_new text,
  ADD COLUMN IF NOT EXISTS real_downloads integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_update_at timestamp with time zone NOT NULL DEFAULT now();

-- SCREENSHOTS
CREATE TABLE IF NOT EXISTS public.app_screenshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_screenshots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_screenshots TO authenticated;
GRANT ALL ON public.app_screenshots TO service_role;
ALTER TABLE public.app_screenshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "screenshots_public_read" ON public.app_screenshots FOR SELECT USING (true);
CREATE POLICY "screenshots_admin_manage" ON public.app_screenshots FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- UPDATES
CREATE TABLE IF NOT EXISTS public.app_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  version text NOT NULL,
  changelog text,
  size text,
  download_url text,
  is_major boolean NOT NULL DEFAULT false,
  released_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_updates TO authenticated;
GRANT ALL ON public.app_updates TO service_role;
ALTER TABLE public.app_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "updates_public_read" ON public.app_updates FOR SELECT USING (true);
CREATE POLICY "updates_admin_manage" ON public.app_updates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- REVIEWS
CREATE TABLE IF NOT EXISTS public.app_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  user_name text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  comment text,
  admin_reply text,
  admin_reply_at timestamptz,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (app_id, user_id)
);
GRANT SELECT ON public.app_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_reviews TO authenticated;
GRANT ALL ON public.app_reviews TO service_role;
ALTER TABLE public.app_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON public.app_reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "reviews_owner_read" ON public.app_reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reviews_owner_insert" ON public.app_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND rating BETWEEN 1 AND 5);
CREATE POLICY "reviews_owner_update" ON public.app_reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_owner_delete" ON public.app_reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reviews_admin_manage" ON public.app_reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER app_reviews_updated_at BEFORE UPDATE ON public.app_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- DOWNLOAD LOG
CREATE TABLE IF NOT EXISTS public.app_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id uuid NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  user_id uuid,
  version text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.app_downloads TO anon;
GRANT SELECT, INSERT ON public.app_downloads TO authenticated;
GRANT ALL ON public.app_downloads TO service_role;
ALTER TABLE public.app_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "downloads_anyone_insert" ON public.app_downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "downloads_admin_read" ON public.app_downloads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.increment_app_downloads()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.apps SET real_downloads = real_downloads + 1 WHERE id = NEW.app_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER app_downloads_increment AFTER INSERT ON public.app_downloads
  FOR EACH ROW EXECUTE FUNCTION public.increment_app_downloads();

-- keep apps.rating in sync with reviews
CREATE OR REPLACE FUNCTION public.sync_app_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target uuid := COALESCE(NEW.app_id, OLD.app_id);
BEGIN
  UPDATE public.apps a
  SET rating = COALESCE((SELECT ROUND(AVG(r.rating)::numeric, 1) FROM public.app_reviews r WHERE r.app_id = target AND r.is_visible), 0)
  WHERE a.id = target;
  RETURN NULL;
END;
$$;

CREATE TRIGGER app_reviews_sync_rating AFTER INSERT OR UPDATE OR DELETE ON public.app_reviews
  FOR EACH ROW EXECUTE FUNCTION public.sync_app_rating();

CREATE INDEX IF NOT EXISTS idx_app_screenshots_app ON public.app_screenshots(app_id);
CREATE INDEX IF NOT EXISTS idx_app_updates_app ON public.app_updates(app_id);
CREATE INDEX IF NOT EXISTS idx_app_reviews_app ON public.app_reviews(app_id);
CREATE INDEX IF NOT EXISTS idx_app_downloads_app ON public.app_downloads(app_id);
