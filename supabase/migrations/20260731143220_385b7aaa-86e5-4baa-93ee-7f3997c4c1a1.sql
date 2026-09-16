-- Portfolio enhancements
ALTER TABLE public.portfolio_items
  ADD COLUMN IF NOT EXISTS details text,
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS project_date text,
  ADD COLUMN IF NOT EXISTS project_url text;

CREATE TABLE IF NOT EXISTS public.portfolio_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.portfolio_items(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_images TO authenticated;
GRANT ALL ON public.portfolio_images TO service_role;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio_images_public_read" ON public.portfolio_images FOR SELECT USING (true);
CREATE POLICY "portfolio_images_admin_write" ON public.portfolio_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Wifi product enhancements
ALTER TABLE public.wifi_products
  ADD COLUMN IF NOT EXISTS os text,
  ADD COLUMN IF NOT EXISTS size text,
  ADD COLUMN IF NOT EXISTS version text,
  ADD COLUMN IF NOT EXISTS developer_name text,
  ADD COLUMN IF NOT EXISTS support_email text,
  ADD COLUMN IF NOT EXISTS support_phone text,
  ADD COLUMN IF NOT EXISTS support_url text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS guide_content text,
  ADD COLUMN IF NOT EXISTS last_update_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE IF NOT EXISTS public.wifi_product_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.wifi_products(id) ON DELETE CASCADE,
  title text NOT NULL,
  youtube_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wifi_product_videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wifi_product_videos TO authenticated;
GRANT ALL ON public.wifi_product_videos TO service_role;
ALTER TABLE public.wifi_product_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wifi_videos_public_read" ON public.wifi_product_videos FOR SELECT USING (true);
CREATE POLICY "wifi_videos_admin_write" ON public.wifi_product_videos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.wifi_product_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.wifi_products(id) ON DELETE CASCADE,
  version text NOT NULL,
  changelog text,
  size text,
  download_url text,
  is_major boolean NOT NULL DEFAULT false,
  released_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wifi_product_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wifi_product_updates TO authenticated;
GRANT ALL ON public.wifi_product_updates TO service_role;
ALTER TABLE public.wifi_product_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wifi_updates_public_read" ON public.wifi_product_updates FOR SELECT USING (true);
CREATE POLICY "wifi_updates_admin_write" ON public.wifi_product_updates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orders: email field
ALTER TABLE public.wifi_orders
  ADD COLUMN IF NOT EXISTS customer_email text;